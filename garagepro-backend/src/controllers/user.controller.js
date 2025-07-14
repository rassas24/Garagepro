import { UserModel } from '../models/UserModel.js';
import { SessionModel } from '../models/SessionModel.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) { next(err); }
};

export const updateMe = async (req, res, next) => {
  try {
    const affectedRows = await UserModel.update(req.user.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUser = await UserModel.getById(req.user.id);
    res.json(updatedUser);
  } catch (err) { next(err); }
};

export const getMySessions = async (req, res, next) => {
  try {
    const sessions = await SessionModel.getByUserId(req.user.id);
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    let currentToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      currentToken = authHeader.split(' ')[1];
    }
    const sessionsWithCurrent = sessions.map(s => ({
      ...s,
      current: currentToken && s.token === currentToken
    }));
    res.json(sessionsWithCurrent);
  } catch (err) { next(err); }
};

export const revokeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await SessionModel.getById(id);
    if (!session || session.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }
    await SessionModel.delete(id);
    res.json({ message: 'Session revoked' });
  } catch (err) { next(err); }
};

export const logoutCurrentSession = async (req, res, next) => {
  try {
    await SessionModel.delete(req.session.id);
    res.json({ message: 'Logged out from current session' });
  } catch (err) { next(err); }
};

export const logoutOtherSessions = async (req, res, next) => {
  try {
    await SessionModel.deleteAllExcept(req.user.id, req.session.id);
    res.json({ message: 'Logged out from all other sessions' });
  } catch (err) { next(err); }
};