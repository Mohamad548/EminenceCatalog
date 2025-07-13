import { query } from '../db.js';

export async function login(username, password) {
  const result = await query(
    'SELECT id, username FROM users WHERE username = $1 AND password = $2',
    [username, password]
  );
  return result.rows[0] || null;
}
