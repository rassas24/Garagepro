import db from '../config/db.js';

export const SessionModel = {
  create: async ({ user_id, token, device, ip_address, expires_at }) => {
    const [result] = await db.query(
      'INSERT INTO sessions (user_id, token, device, ip_address, created_at, expires_at) VALUES (?, ?, ?, ?, NOW(), ?)',
      [user_id, token, device, ip_address, expires_at]
    );
    return { id: result.insertId, user_id, token, device, ip_address, expires_at };
  },
  getByUserId: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM sessions WHERE user_id = ?', [user_id]);
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM sessions WHERE id = ?', [id]);
    return rows[0];
  },
  getByToken: async (token) => {
    const [rows] = await db.query('SELECT * FROM sessions WHERE token = ?', [token]);
    return rows[0];
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM sessions WHERE id = ?', [id]);
    return result.affectedRows;
  },
  deleteByToken: async (token) => {
    const [result] = await db.query('DELETE FROM sessions WHERE token = ?', [token]);
    return result.affectedRows;
  },
  deleteAllByUserId: async (user_id) => {
    const [result] = await db.query('DELETE FROM sessions WHERE user_id = ?', [user_id]);
    return result.affectedRows;
  },
  deleteAllExcept: async (user_id, except_id) => {
    await db.query('DELETE FROM sessions WHERE user_id = ? AND id != ?', [user_id, except_id]);
  },
}; 