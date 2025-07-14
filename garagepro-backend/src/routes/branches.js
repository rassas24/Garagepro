import express from 'express';
import { getBranches, createBranch } from '../controllers/branch.controller.js';
import { getBranchJobs } from '../controllers/job.controller.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
// router.use(authenticate, authorize('admin'));
router.get('/', getBranches);
router.post('/', createBranch);
router.get('/:id/jobs', getBranchJobs);
router.get('/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));
// GET /:id, PUT, DELETE...
export default router;