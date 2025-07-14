import { CameraModel } from '../models/CameraModel.js';
import path from 'path';
import { spawn } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import db from '../config/db.js'; // Added import for db

// Stub for password decryption (replace with real logic)
function decryptPassword(encrypted) {
  // TODO: Replace with real decryption
  return encrypted;
}

// Track running ffmpeg processes per camera
const ffmpegProcesses = {};

// Function to check if camera stream is active
export const isCameraStreamActive = (cameraId) => {
  return ffmpegProcesses[cameraId] && !ffmpegProcesses[cameraId].killed;
};

// Function to stop camera stream and cleanup
export const stopCameraStream = (cameraId) => {
  try {
    console.log(`[stopCameraStream] Stopping stream for camera ${cameraId}`);
    
    // Kill the FFmpeg process if it exists
    if (ffmpegProcesses[cameraId]) {
      console.log(`[stopCameraStream] Killing FFmpeg process for camera ${cameraId}`);
      ffmpegProcesses[cameraId].kill('SIGTERM');
      delete ffmpegProcesses[cameraId];
    }
    
    // Clean up HLS files
    const hlsDir = path.join(process.cwd(), 'tmp', 'hls');
    const m3u8File = path.join(hlsDir, `${cameraId}.m3u8`);
    const tsFiles = path.join(hlsDir, `${cameraId}_*.ts`);
    
    // Remove .m3u8 file
    if (fs.existsSync(m3u8File)) {
      fs.unlinkSync(m3u8File);
      console.log(`[stopCameraStream] Removed ${m3u8File}`);
    }
    
    // Remove .ts files
    try {
      const tsFilesList = fs.readdirSync(hlsDir).filter(file => file.startsWith(`${cameraId}_`) && file.endsWith('.ts'));
      tsFilesList.forEach(file => {
        fs.unlinkSync(path.join(hlsDir, file));
        console.log(`[stopCameraStream] Removed ${file}`);
      });
    } catch (err) {
      console.log(`[stopCameraStream] No .ts files to remove for camera ${cameraId}`);
    }
    
    console.log(`[stopCameraStream] Successfully stopped stream for camera ${cameraId}`);
  } catch (error) {
    console.error(`[stopCameraStream] Error stopping stream for camera ${cameraId}:`, error);
  }
};

// Periodic cleanup function to stop streams for completed jobs
const cleanupCompletedJobStreams = async () => {
  try {
    // Get all active camera streams
    const activeCameraIds = Object.keys(ffmpegProcesses);
    
    if (activeCameraIds.length === 0) return;
    
    // Check which cameras are still assigned to active jobs
    const [activeJobs] = await db.query(
      'SELECT DISTINCT camera_id FROM jobs WHERE camera_id IN (?) AND status != "completed"',
      [activeCameraIds]
    );
    
    const activeCameraIdsSet = new Set(activeJobs.map(job => job.camera_id));
    
    // Stop streams for cameras that are no longer assigned to active jobs
    activeCameraIds.forEach(cameraId => {
      if (!activeCameraIdsSet.has(parseInt(cameraId))) {
        console.log(`[cleanupCompletedJobStreams] Stopping stream for camera ${cameraId} - no active jobs`);
        stopCameraStream(cameraId);
      }
    });
  } catch (error) {
    console.error('[cleanupCompletedJobStreams] Error during cleanup:', error);
  }
};

// Run cleanup every 30 seconds
setInterval(cleanupCompletedJobStreams, 30000);

export const getCameras = async (req, res, next) => {
  try {
    const { branchId, status } = req.query;
    console.log('[getCameras] branchId:', branchId, 'status:', status);
    if (!branchId) {
      return res.status(400).json({ message: 'branchId is required' });
    }
    let data = await CameraModel.getAllByBranch(branchId);
    if (status) {
      data = data.filter(c => c.status === status);
    } else {
      data = data.filter(c => c.status === 'available');
    }
    // Assertion: if any camera in DB is available, it must be in the result
    const allCams = await CameraModel.getAllByBranch(branchId);
    const availableCams = allCams.filter(c => c.status === 'available');
    if (availableCams.length > 0 && data.length === 0) {
      console.error('[getCameras] Available cameras exist but not returned:', availableCams);
      return res.status(500).json({ error: 'Available cameras exist but not returned' });
    }
    res.json(data);
    console.log('[getCameras] Returned cameras:', data.map(c => ({ id: c.id, label: c.label, status: c.status })));
  } catch (err) { next(err); }
};

export const createCamera = async (req, res, next) => {
  try {
    const { label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, login_method } = req.body;
    console.log('createCamera payload:', req.body);
    // Determine login method
    let method = login_method;
    if (!method) {
      if (stream_url && protocol && port) {
        method = 'url';
      } else if (username && password_encrypted) {
        method = 'userpass';
      }
    }
    if (!label || !ip_address || !branch_id || !protocol) {
      return res.status(400).json({ message: 'Missing required field: label, ip_address, branch_id, or protocol' });
    }
    if (method === 'url') {
      if (!stream_url || !port) {
        return res.status(400).json({ message: 'Missing required field for URL login: stream_url or port' });
      }
    } else if (method === 'userpass') {
      if (!username || !password_encrypted) {
        return res.status(400).json({ message: 'Missing required field for user/pass login: username or password_encrypted' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid or missing login method' });
    }
    const camera = await CameraModel.create({ label, ip_address, port, protocol, stream_url, username, password_encrypted, branch_id, bay_zone, model, notes, status: 'available', login_method: method });
    res.status(201).json(camera);
  } catch (err) {
    console.error('Error in createCamera:', err);
    next(err);
  }
};

export const getCameraById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camera = await CameraModel.getById(id);
    console.log('[getCameraById] id:', id, 'found:', !!camera);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.json(camera);
  } catch (err) { next(err); }
};

export const getCameraStream = async (req, res, next) => {
  try {
    const { cameraId } = req.params;
    console.log(`[getCameraStream] Request for camera ${cameraId}`);
    
    const camera = await CameraModel.getById(cameraId);
    if (!camera) {
      console.log(`[getCameraStream] Camera ${cameraId} not found`);
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    const decryptedPassword = camera.password_encrypted ? decryptPassword(camera.password_encrypted) : '';
    let url;
    
    if (camera.stream_url) {
      url = camera.stream_url;
    } else if (camera.username && decryptedPassword) {
      url = `${camera.protocol.toLowerCase()}://${camera.username}:${decryptedPassword}@${camera.ip_address}:${camera.port}`;
    } else {
      url = `${camera.protocol.toLowerCase()}://${camera.ip_address}:${camera.port}`;
    }
    
    console.log(`[getCameraStream] CameraId: ${cameraId}, Protocol: ${camera.protocol}, URL: ${url}`);
    
    if (camera.protocol.toLowerCase() === 'rtsp') {
      console.log(`[getCameraStream] Starting RTSP to HLS conversion for camera ${cameraId}`);
      
      // Check if stream is already active
      if (isCameraStreamActive(cameraId)) {
        console.log(`[getCameraStream] Stream already active for camera ${cameraId}, returning existing URL`);
        return res.json({ streamUrl: `/hls/${cameraId}.m3u8` });
      }
      
      // Kill existing process if any (in case it's stuck)
      if (ffmpegProcesses[cameraId]) {
        console.log(`[getCameraStream] Killing existing FFmpeg process for camera ${cameraId}`);
        ffmpegProcesses[cameraId].kill('SIGTERM');
      }
      
      const hlsDir = path.join(process.cwd(), 'tmp', 'hls');
      const outputFile = path.join(hlsDir, `${cameraId}.m3u8`);
      
      // Ensure HLS directory exists
      if (!fs.existsSync(hlsDir)) {
        fs.mkdirSync(hlsDir, { recursive: true });
      }
      
      const command = ffmpeg(url)
        .addOption('-rtsp_transport', 'tcp')
        .addOption('-c:v', 'copy')
        .addOption('-f', 'hls')
        .addOption('-hls_time', '2')
        .addOption('-hls_list_size', '3')
        .addOption('-hls_flags', 'delete_segments')
        .output(outputFile);
      
      console.log(`[getCameraStream] FFmpeg command: ${command._getArguments().join(' ')}`);
      
      const ffmpegProcess = command
        .on('start', (commandLine) => {
          console.log(`[FFmpeg][start] Camera ${cameraId}: ${commandLine}`);
        })
        .on('stderr', (stderrLine) => {
          console.log(`[FFmpeg][stderr] Camera ${cameraId}: ${stderrLine}`);
        })
        .on('error', (err) => {
          console.error(`[FFmpeg][error] Camera ${cameraId}: ${err.message}`);
          delete ffmpegProcesses[cameraId];
        })
        .on('end', () => {
          console.log(`[FFmpeg][end] Camera ${cameraId}: FFmpeg process ended`);
          delete ffmpegProcesses[cameraId];
        });
      
      // Store the process for later cleanup
      ffmpegProcesses[cameraId] = ffmpegProcess;
      
      ffmpegProcess.run();
      
      // Wait for the .m3u8 file to be created
      const waitForFile = (file, timeout = 5000) => new Promise((resolve, reject) => {
        const startTime = Date.now();
        (function check() {
          if (fs.existsSync(file)) {
            console.log(`[getCameraStream] HLS file created: ${file}`);
            resolve();
          } else if (Date.now() - startTime > timeout) {
            console.error(`[getCameraStream] Timeout waiting for HLS file: ${file}`);
            reject(new Error('HLS file creation timeout'));
          } else {
            setTimeout(check, 100);
          }
        })();
      });
      
      try {
        await waitForFile(outputFile);
        streamUrl = `/hls/${cameraId}.m3u8`;
      } catch (error) {
        console.error(`[getCameraStream] Failed to create HLS for camera ${cameraId}:`, error);
        return res.status(500).json({ message: 'Failed to start camera stream' });
      }
    } else {
      // For HTTP/HLS, return the direct URL
      streamUrl = url;
    }
    
    console.log(`[getCameraStream] Returning stream URL for camera ${cameraId}: ${streamUrl}`);
    return res.json({ streamUrl });
  } catch (err) {
    console.error(`[getCameraStream] Error for camera ${cameraId}:`, err);
    return res.status(500).json({ message: 'Failed to get camera stream' });
  }
};

export { decryptPassword };