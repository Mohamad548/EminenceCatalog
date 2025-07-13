import { query } from './db.js';

async function createTables() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        image TEXT,
        code VARCHAR(50),
        name VARCHAR(200),
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        price1 INTEGER,
        price2 INTEGER,
        price_customer INTEGER,
        description TEXT
      );
    `);

    console.log('✅ جداول با موفقیت ساخته شدند.');
  } catch (err) {
    console.error('❌ خطا در ساخت جداول:', err);
  }
}

createTables();
