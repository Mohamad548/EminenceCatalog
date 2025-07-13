import { query } from '../db.js';

async function seedUser() {
  try {
    await query(
      'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['admin', '123']
    );
    console.log('کاربر admin با رمز 123 ایجاد شد');
  } catch (error) {
    console.error('خطا در ایجاد کاربر:', error);
  } finally {
    process.exit();
  }
}

seedUser();
