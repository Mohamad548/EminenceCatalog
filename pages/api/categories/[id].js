import pool from "@/lib/db.mjs";


export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { name } = req.body;

    try {
      const result = await pool.query(
        'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // حذف محصولات مرتبط
      await pool.query('DELETE FROM products WHERE categoryId = $1', [id]);

      // حذف دسته‌بندی
      const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
