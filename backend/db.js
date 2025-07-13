import { login } from "./queries/users";


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'فقط POST مجاز است' });
  }

  const { username, password } = req.body;

  try {
    const user = await login(username, password);
    if (!user) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('خطا در API لاگین:', error);
    res.status(500).json({ error: 'خطای سرور' });
  }
}
