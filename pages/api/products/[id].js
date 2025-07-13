import pool from '@/lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [
        id,
      ]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  } else if (req.method === 'PATCH') {
    const { name, price, description, categoryId } = req.body;

    try {
      const result = await pool.query(
        `UPDATE products SET
          name = COALESCE($1, name),
          price = COALESCE($2, price),
          description = COALESCE($3, description),
          categoryId = COALESCE($4, categoryId)
        WHERE id = $5 RETURNING *`,
        [name, price, description, categoryId, id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
