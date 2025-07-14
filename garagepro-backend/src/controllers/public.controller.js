import { getCameraStream, decryptPassword } from './camera.controller.js';
import { JobModel } from '../models/JobModel.js';
import { CameraModel } from '../models/CameraModel.js';

// Public stream access with optional token validation
export const getPublicStream = async (req, res) => {
  try {
    const { jobId, cameraId } = req.params;
    const { token } = req.query; // Optional token for additional security
    
    console.log(`[getPublicStream] Request for job ${jobId}, camera ${cameraId}`);
    
    // Verify job exists and is active
    const job = await JobModel.getById(jobId);
    if (!job) {
      console.log(`[getPublicStream] Job ${jobId} not found`);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if job is active (not completed)
    if (job.status === 'completed') {
      console.log(`[getPublicStream] Job ${jobId} is completed`);
      return res.status(410).json({ message: 'Job is completed' });
    }
    
    // Optional: Validate token if provided
    if (token) {
      // In a real implementation, you'd validate the token
      // For now, we'll just check if it's a valid format
      if (token.length < 10) {
        console.log(`[getPublicStream] Invalid token for job ${jobId}`);
        return res.status(401).json({ message: 'Invalid access token' });
      }
    }
    
    // Get camera stream URL
    const camera = await CameraModel.getById(cameraId);
    if (!camera) {
      console.log(`[getPublicStream] Camera ${cameraId} not found`);
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    // Check if camera belongs to the job's branch
    if (camera.branch_id !== job.branch_id) {
      console.log(`[getPublicStream] Camera ${cameraId} does not belong to job ${jobId} branch`);
      return res.status(403).json({ message: 'Camera not accessible for this job' });
    }
    
    // Generate stream URL (same logic as authenticated endpoint)
    const decryptedPassword = camera.password_encrypted ? decryptPassword(camera.password_encrypted) : '';
    let streamUrl;
    
    if (camera.stream_url) {
      streamUrl = camera.stream_url;
    } else if (camera.username && decryptedPassword) {
      streamUrl = `${camera.protocol.toLowerCase()}://${camera.username}:${decryptedPassword}@${camera.ip_address}:${camera.port}`;
    } else {
      streamUrl = `${camera.protocol.toLowerCase()}://${camera.ip_address}:${camera.port}`;
    }
    
    console.log(`[getPublicStream] Returning stream URL for job ${jobId}, camera ${cameraId}`);
    
    // For RTSP, return HLS URL
    if (camera.protocol.toLowerCase() === 'rtsp') {
      streamUrl = `/hls/${cameraId}.m3u8`;
    }
    
    res.json({ 
      streamUrl,
      job: {
        id: job.id,
        car_model: job.car_model,
        car_year: job.car_year,
        status: job.status
      },
      camera: {
        id: camera.id,
        label: camera.label
      }
    });
    
  } catch (error) {
    console.error(`[getPublicStream] Error:`, error);
    res.status(500).json({ message: 'Failed to get public stream' });
  }
}; 