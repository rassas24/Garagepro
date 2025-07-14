import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import branchRoutes from './routes/branches.js';
import jobRoutes from './routes/jobs.js';
import cameraRoutes from './routes/cameras.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import whatsappRoutes from './routes/whatsapp.js';
import { authenticate, authorize } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import path from 'path';
import { stopCameraStream } from './controllers/camera.controller.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/branches', authenticate, branchRoutes);
app.use('/api/v1/cameras', authenticate, cameraRoutes);
app.use('/api/v1/jobs', authenticate, jobRoutes);
app.use('/api/v1/users', authenticate, userRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/whatsapp', authenticate, whatsappRoutes);
app.use('/hls', express.static(path.join(process.cwd(), 'tmp', 'hls')));

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('Received shutdown signal, cleaning up...');
  
  // Stop all camera streams
  const { ffmpegProcesses } = require('./controllers/camera.controller.js');
  Object.keys(ffmpegProcesses).forEach(cameraId => {
    console.log(`Stopping camera stream ${cameraId} during shutdown`);
    stopCameraStream(cameraId);
  });
  
  process.exit(0);
};

// Listen for shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
