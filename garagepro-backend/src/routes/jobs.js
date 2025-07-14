import express from 'express';
import { getJobs } from '../controllers/job.controller.js';
import { createJob } from '../controllers/job.controller.js';
import { updateJob } from '../controllers/job.controller.js';
import { getJobById } from '../controllers/job.controller.js';
import { releaseJob } from '../controllers/job.controller.js';
import { getJobsHistory, completeJob } from '../controllers/job.controller.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/history', getJobsHistory);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);
router.post('/:id/release', releaseJob);
router.post('/:id/complete', completeJob);

export default router;