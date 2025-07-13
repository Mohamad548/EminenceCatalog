import { login } from "@/backend/queries/users";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = await login(username, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'نام کاربری یا رمز اشتباه است' });
    }
  } else {
    res.status(405).json({ error: 'فقط متد POST مجاز است' });
  }
}
