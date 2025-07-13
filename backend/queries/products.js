import { query } from '../db.js';

// گرفتن همه محصولات
export async function getProducts() {
  const result = await query(
    `SELECT products.*, categories.name AS category_name 
     FROM products 
     LEFT JOIN categories ON products.category_id = categories.id`
  );
  return result.rows;
}

// گرفتن محصول بر اساس ID
export async function getProductById(id) {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// افزودن محصول
export async function addProduct(productData) {
  const {
    image,
    code,
    name,
    categoryId,
    price1,
    price2,
    priceCustomer,
    description
  } = productData;

  const result = await query(
    `INSERT INTO products 
     (image, code, name, category_id, price1, price2, price_customer, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [image, code, name, categoryId, price1, price2, priceCustomer, description]
  );
  return result.rows[0];
}

// به‌روزرسانی محصول
export async function updateProduct(id, data) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${camelToSnake(field)} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE products SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
}

// حذف محصول
export async function deleteProduct(id) {
  await query('DELETE FROM products WHERE id = $1', [id]);
  return true;
}

// تبدیل camelCase به snake_case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
