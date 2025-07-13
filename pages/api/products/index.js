import pool from '@/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        ORDER BY p.id
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    const { name, price, description, categoryId } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO products (name, price, description, categoryId)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, price, description, categoryId]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
