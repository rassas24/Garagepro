import bcrypt from 'bcrypt';
import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedSuperUser = async () => {
  try {
    const email = 'super@garagepro.com';
    const password = 'superpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log('Superuser already exists.');
      return;
    }

    await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, phone_country_code, phone_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Super', 'User', email, hashedPassword, 'admin', '+1', '5555555555']
    );

    console.log('Superuser created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error seeding superuser:', error);
  } finally {
    db.end();
  }
};

seedSuperUser();