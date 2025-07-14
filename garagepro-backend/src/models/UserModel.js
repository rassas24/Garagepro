import db from '../config/db.js';

export const UserModel = {
  getById: async (id) => {
    const [rows] = await db.query('SELECT id, first_name, last_name, email, phone_country_code, phone_number, avatar_url, role, default_branch_id, default_view, two_fa_enabled, session_timeout_hours FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  update: async (id, data) => {
    const { first_name, last_name, email, phone_country_code, phone_number, default_branch_id, default_view, avatar_url, two_fa_enabled, session_timeout_hours } = data;
    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_country_code = ?, phone_number = ?, default_branch_id = ?, default_view = ?, avatar_url = ?, two_fa_enabled = ?, session_timeout_hours = ? WHERE id = ?',
      [first_name, last_name, email, phone_country_code, phone_number, default_branch_id, default_view, avatar_url, two_fa_enabled, session_timeout_hours, id]
    );
    return result.affectedRows;
  },
  // ... other user model functions
};