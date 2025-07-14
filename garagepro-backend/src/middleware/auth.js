import jwt from 'jsonwebtoken';
import { SessionModel } from '../models/SessionModel.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Authenticating token:', authHeader); // Added logging

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authentication token is required.');
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check session in DB
    const session = await SessionModel.getByToken(token);
    if (!session) {
      return res.status(401).json({ message: 'Session not found or revoked.' });
    }
    if (new Date(session.expires_at) < new Date()) {
      await SessionModel.delete(session.id); // Clean up expired session
      return res.status(401).json({ message: 'Session expired.' });
    }
    req.user = decoded;
    req.session = session;
    console.log('Token valid, user:', decoded);
    next();
  } catch (error) {
    console.log('Invalid or expired token:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};
