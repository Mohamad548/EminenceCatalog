import pool from "@/lib/db.mjs";


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, password } = req.query;

    try {
      const result = await pool.query(
        'SELECT id, username, email, full_name FROM users WHERE username = $1 AND password = $2',
        [username, password]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error on login' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
