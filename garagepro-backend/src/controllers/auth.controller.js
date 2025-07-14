import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { SessionModel } from '../models/SessionModel.js';

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const login = async (req, res, next) => {
  const { email, password, sessionTimeout, device, ip_address } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { password_hash, ...userWithoutPassword } = user;

    // Use sessionTimeout from frontend, fallback to 8h if not provided
    const timeoutHours = Number(sessionTimeout) || 8;
    const expiresIn = `${timeoutHours}h`;
    const expiresAt = new Date(Date.now() + timeoutHours * 60 * 60 * 1000);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Save session in DB
    await SessionModel.create({
      user_id: user.id,
      token,
      device: device || req.headers['user-agent'] || 'unknown',
      ip_address: ip_address || req.ip,
      expires_at: expiresAt
    });

    res.json({ token, user: userWithoutPassword, expiresAt });

  } catch (err) {
    next(err);
  }
};