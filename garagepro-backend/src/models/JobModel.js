import db from '../config/db.js';

export const JobModel = {
  getAllByBranch: async (branchId) => {
    const [rows] = await db.query('SELECT * FROM jobs WHERE branch_id = ?', [branchId]);
    return rows;
  },
  create: async (data) => {
    const { customer_name, customer_phone_country_code, customer_phone_number, car_model, car_year, entered_at, camera_id, issue_description, branch_id, status } = data;
    
    // Check if camera is already in use
    const [existingJobs] = await db.query(
      'SELECT id FROM jobs WHERE camera_id = ? AND status != "completed"',
      [camera_id]
    );
    
    if (existingJobs.length > 0) {
      throw new Error('Camera is already assigned to another active job');
    }
    
    // Log camera status before job creation
    const [camRowsBefore] = await db.query('SELECT id, status FROM cameras WHERE id = ?', [camera_id]);
    console.log('[JobModel.create] Camera before job:', camRowsBefore);
    
    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Create the job
      const [result] = await connection.query(
        `INSERT INTO jobs (customer_name, customer_phone_country_code, customer_phone_number, car_model, car_year, entered_at, camera_id, issue_description, branch_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_name, customer_phone_country_code, customer_phone_number, car_model, car_year, entered_at, camera_id, issue_description, branch_id, status || 'in_progress']
      );
      
      // Update camera status to in_use
      await connection.query(
        'UPDATE cameras SET status = "in_use" WHERE id = ?',
        [camera_id]
      );
      
      // Log camera status after job creation
      const [camRowsAfter] = await db.query('SELECT id, status FROM cameras WHERE id = ?', [camera_id]);
      console.log('[JobModel.create] Camera after job:', camRowsAfter);
      
      await connection.commit();
      return { id: result.insertId, ...data };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    if (fields.length === 0) return 0;
    values.push(id);
    
    // Start transaction if status is being updated
    if (data.status) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        
        // Get the current job to check camera_id
        const [currentJob] = await connection.query('SELECT camera_id FROM jobs WHERE id = ?', [id]);
        
        if (currentJob.length > 0) {
          const cameraId = currentJob[0].camera_id;
          
          // Update the job
          const [result] = await connection.query(
            `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`,
            values
          );
          
          // Update camera status based on job status
          if (data.status === 'completed') {
            // Free up the camera when job is completed
            await connection.query(
              'UPDATE cameras SET status = "available" WHERE id = ?',
              [cameraId]
            );
          } else if (data.status === 'in_progress') {
            // Mark camera as in use when job is active
            await connection.query(
              'UPDATE cameras SET status = "in_use" WHERE id = ?',
              [cameraId]
            );
          }
          
          await connection.commit();
          return result.affectedRows;
        }
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
    
    // Regular update without status change
    const [result] = await db.query(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0] || null;
  },
  getCompleted: async () => {
    const [rows] = await db.query('SELECT * FROM jobs WHERE status = "completed" ORDER BY completed_at DESC');
    return rows;
  },
  getCompletedByBranch: async (branchId) => {
    const [rows] = await db.query('SELECT * FROM jobs WHERE status = "completed" AND branch_id = ? ORDER BY completed_at DESC', [branchId]);
    return rows;
  },
  complete: async (id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      // Only update if job is in_progress
      const [jobRows] = await connection.query('SELECT * FROM jobs WHERE id = ?', [id]);
      if (!jobRows.length) {
        await connection.rollback();
        return { error: 'Job not found', status: 404 };
      }
      const job = jobRows[0];
      if (job.status !== 'in_progress') {
        await connection.rollback();
        return { error: 'Job not in progress', status: 400 };
      }
      // Log camera status before completion
      if (job.camera_id) {
        const [camRowsBefore] = await connection.query('SELECT id, status FROM cameras WHERE id = ?', [job.camera_id]);
        console.log('[JobModel.complete] Camera before completion:', camRowsBefore);
      }
      await connection.query('UPDATE jobs SET status = "completed", completed_at = NOW() WHERE id = ?', [id]);
      if (job.camera_id) {
        await connection.query('UPDATE cameras SET status = "available" WHERE id = ?', [job.camera_id]);
        // Log camera status after completion
        const [camRowsAfter] = await connection.query('SELECT id, status FROM cameras WHERE id = ?', [job.camera_id]);
        console.log('[JobModel.complete] Camera after completion:', camRowsAfter);
      }
      const [updatedRows] = await connection.query('SELECT * FROM jobs WHERE id = ?', [id]);
      await connection.commit();
      return { job: updatedRows[0] };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};