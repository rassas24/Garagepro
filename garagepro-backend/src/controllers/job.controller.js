import { JobModel } from '../models/JobModel.js';
import { CameraModel } from '../models/CameraModel.js';
import { stopCameraStream } from './camera.controller.js';

export const getJobs = async (req, res, next) => {
  try {
    const { branchId } = req.query;
    if (!branchId) {
      return res.status(400).json({ message: 'branchId is required' });
    }
    const data = await JobModel.getAllByBranch(branchId);
    res.json(data);
  } catch (err) { next(err); }
};

export const createJob = async (req, res, next) => {
  try {
    // Validate camera existence
    const { camera_id } = req.body;
    if (camera_id) {
      const { CameraModel } = await import('../models/CameraModel.js');
      const camera = await CameraModel.getById(camera_id);
      if (!camera) {
        console.error('[createJob] Camera not found for id:', camera_id);
        return res.status(400).json({ error: 'Camera not found' });
      }
    }
    const job = await JobModel.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    if (err.message === 'Camera is already assigned to another active job') {
      return res.status(409).json({ error: 'Camera already in use' });
    }
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await JobModel.update(id, req.body);
    if (updated === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job updated' });
  } catch (err) { next(err); }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await JobModel.getById(id);
    console.log('[getJobById] id:', id, 'found:', !!job);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) { next(err); }
};

export const releaseJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Get the job to find the camera_id
    const job = await JobModel.getById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const cameraId = job.camera_id;
    if (!cameraId) {
      return res.status(400).json({ message: 'Job does not have a camera assigned' });
    }
    // Set camera status to available
    const db = (await import('../config/db.js')).default;
    await db.query('UPDATE cameras SET status = "available" WHERE id = ?', [cameraId]);
    res.json({ message: 'Camera released' });
  } catch (err) {
    next(err);
  }
};

export const getBranchJobs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    let jobs = await JobModel.getAllByBranch(id);
    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }
    res.json(jobs);
  } catch (err) { next(err); }
};

export const getJobsHistory = async (req, res, next) => {
  try {
    const { branchId } = req.query;
    let jobs;
    if (branchId) {
      jobs = await JobModel.getCompletedByBranch(branchId);
    } else {
      jobs = await JobModel.getCompleted();
    }
    res.json(jobs);
  } catch (err) { next(err); }
};

export const completeJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await JobModel.getById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Stop the camera stream for this job
    if (job.camera_id) {
      console.log(`[completeJob] Stopping camera stream for job ${id}, camera ${job.camera_id}`);
      stopCameraStream(job.camera_id);
    }

    const result = await JobModel.complete(id);
    if (result.error) {
      console.error('[completeJob] error:', result.error);
      return res.status(result.status || 400).json({ error: result.error });
    }
    
    res.json(result.job);
  } catch (error) {
    console.error('Error completing job:', error);
    next(error);
  }
};