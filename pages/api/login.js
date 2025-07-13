import { query } from "../../db.js";


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const result = await query(
      'SELECT id, username FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // در اینجا می‌توان توکن JWT ساخت یا داده کاربر را برگرداند
    res.status(200).json(user);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
