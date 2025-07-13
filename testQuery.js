import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  return pool.query(text, params);
}

async function test() {
  try {
    const result = await query('SELECT NOW()');
    console.log('زمان سرور:', result.rows[0]);
  } catch (error) {
    console.error('خطا در کوئری:', error);
  } finally {
    process.exit();
  }
}

test();
