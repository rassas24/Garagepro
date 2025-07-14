import db from '../config/db.js';

export const BranchModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM branches');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM branches WHERE id=?', [id]);
    return rows[0];
  },
  create: async (data) => {
    const { name, address, time_zone, contact_phone_country_code, contact_phone_number, logo_url } = data;
    const [result] = await db.query(
      `INSERT INTO branches (name,address,time_zone,contact_phone_country_code,contact_phone_number,logo_url)
       VALUES(?,?,?,?,?,?)`,
       [name,address,time_zone,contact_phone_country_code,contact_phone_number,logo_url]
    );
    return { id: result.insertId, ...data };
  },
  update: async (id, data) => {
    // build SET clause dynamically…
  },
  delete: async (id) => {
    await db.query('DELETE FROM branches WHERE id=?', [id]);
  }
};