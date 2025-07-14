import express from 'express';
import { getCameras, createCamera, getCameraById, getCameraStream } from '../controllers/camera.controller.js';

const router = express.Router();

router.get('/', getCameras);
router.post('/', createCamera);
router.get('/:id', getCameraById);
router.get('/:cameraId/stream', getCameraStream);

export default router;