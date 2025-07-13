import { query } from './db.js';

async function createTables() {
  try {
    // جدول کاربران
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    // جدول دسته‌بندی‌ها
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL
      );
    `);

    // جدول محصولات
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        image TEXT,
        code VARCHAR(50),
        name VARCHAR(255),
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        price1 INTEGER,
        price2 INTEGER,
        price_customer INTEGER,
        description TEXT
      );
    `);

    console.log("✅ جدول‌ها با موفقیت ساخته شدند");
  } catch (error) {
    console.error("❌ خطا در ساخت جدول‌ها:", error);
  }
}

createTables();
