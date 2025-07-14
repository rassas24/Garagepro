import express from 'express';
import { getMe, updateMe, getMySessions, revokeSession, logoutCurrentSession, logoutOtherSessions } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.get('/me/sessions', authenticate, getMySessions);
router.delete('/me/sessions/:id', authenticate, revokeSession);
router.post('/me/logout', authenticate, logoutCurrentSession);
router.post('/me/logout-others', authenticate, logoutOtherSessions);

export default router;