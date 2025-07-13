import { query } from '../db.js';

// گرفتن همه دسته‌بندی‌ها
export async function getCategories() {
  const result = await query('SELECT * FROM categories ORDER BY id');
  return result.rows;
}

// افزودن دسته‌بندی
export async function addCategory(name) {
  const result = await query('INSERT INTO categories(name) VALUES($1) RETURNING *', [name]);
  return result.rows[0];
}

// به‌روزرسانی دسته‌بندی
export async function updateCategory(id, name) {
  const result = await query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
  return result.rows[0];
}

// حذف دسته‌بندی (به همراه حذف محصولات مرتبط)
export async function deleteCategory(id) {
  await query('DELETE FROM products WHERE category_id = $1', [id]);
  await query('DELETE FROM categories WHERE id = $1', [id]);
  return true;
}
