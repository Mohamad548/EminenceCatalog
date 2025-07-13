import pool from "@/lib/db.mjs";


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY id');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add category' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
