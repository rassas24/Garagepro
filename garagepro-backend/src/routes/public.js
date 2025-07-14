import express from 'express';
import { getPublicStream } from '../controllers/public.controller.js';

const router = express.Router();

// Public stream access (no authentication required)
router.get('/stream/:jobId/:cameraId', getPublicStream);

export default router; 