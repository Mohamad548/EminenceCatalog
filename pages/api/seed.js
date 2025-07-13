import { query } from '../../db.js'; // مسیر را بسته به مکان واقعی فایل db.js تغییر بده

async function seed() {
  try {
    await query(
      `INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
      ['admin', '123']
    );
    console.log('✅ کاربر admin وارد شد');
  } catch (err) {
    console.error('❌ خطا در وارد کردن کاربر:', err);
  } finally {
    process.exit();
  }
}

seed();
