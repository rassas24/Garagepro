import db from '../config/db.js';

export const CameraModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM cameras');
    return rows;
  },
  getAllByBranch: async (branchId) => {
    const [rows] = await db.query('SELECT * FROM cameras WHERE branch_id = ?', [branchId]);
    return rows;
  },
  getAvailableByBranch: async (branchId) => {
    const [rows] = await db.query('SELECT * FROM cameras WHERE branch_id = ? AND status = "available"', [branchId]);
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM cameras WHERE id = ?', [id]);
    return rows[0] || null;
  },
  create: async ({ label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, status, login_method }) => {
    const [result] = await db.query(
      'INSERT INTO cameras (label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, status, login_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, status, login_method]
    );
    return { id: result.insertId, label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, status, login_method };
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
    const [result] = await db.query(
      `UPDATE cameras SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM cameras WHERE id = ?', [id]);
    return result.affectedRows;
  },
};