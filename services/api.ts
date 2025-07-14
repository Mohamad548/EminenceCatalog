import { BASE_URL } from '@/pages/URL/url';
import { CredentialsUpdatePayload, Product, User } from '@/types';
import axios from 'axios';
const apiClient = axios.create({
  baseURL: BASE_URL, // آدرس سرور بک‌اند
});

export async function login(username: string, password: string) {
  try {
    const response = await apiClient.post('api/auth/login', {
      username,
      password,
    });
    return response.data; // پاسخ موفق (کاربر) یا خطا
  } catch (error) {
    return null;
  }
}

export interface CredentialsUpdatePayload {
  userId: string;
  username: string;
  currentPassword?: string; // رمز فعلی برای تغییر رمز ضروری است
  newPassword?: string;     // رمز جدید (اختیاری)
}

export const updateUserCredentials = async (
  data: CredentialsUpdatePayload
): Promise<User | null> => {
  try {
    const payload: any = { username: data.username };

    // اگر قصد تغییر رمز داریم، currentPassword و newPassword را ارسال کن
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new Error('Current password is required to change password');
      }
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }

   const response = await apiClient.put<User>(
  `/api/users/user/${data.userId}`, // اینجا مسیر را اصلاح کردیم
  payload
    );
    return response.data;
  } catch (error) {
    console.error('Update credentials API error:', error);
    return null;
  }
};

// --- Categories ---
export interface Category {
  id: number;
  name: string;
}

// گرفتن همه دسته‌ها
export const getCategories = async (): Promise<Category[] | null> => {
  try {
    const response = await apiClient.get('api/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to get categories:', error);
    return null;
  }
};

// اضافه کردن دسته جدید
export const addCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post('api/categories', { name });
  return response.data;
};

// به‌روزرسانی دسته
export const updateCategory = async (
  id: number,
  name: string
): Promise<Category> => {
  const response = await apiClient.patch(`api/categories/${id}`, { name });
  return response.data;
};

// حذف دسته و محصولات مرتبط
export const deleteCategory = async (id: number): Promise<boolean> => {
  // ابتدا محصولات مرتبط حذف شده‌اند در بک‌اند، پس فقط درخواست حذف دسته می‌فرستیم
  await apiClient.delete(`api/categories/${id}`);
  return true;
};
// --- Products ---

export const addProduct = async (formData: FormData): Promise<Product> => {
  const response = await apiClient.post('api/products', formData);
  return response.data;
};

// ویرایش محصول
export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  const response = await apiClient.patch(`api/products/${id}`, formData);
  return response.data;
};

// دریافت یک محصول
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`api/products/${id}`);
    return response.data;
  } catch (e) {
    return null;
  }
};

// دریافت همه محصولات
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('api/products');
  return response.data;
};

// حذف محصول
export const deleteProduct = async (id: number): Promise<boolean> => {
  await apiClient.delete(`api/products/${id}`);
  return true;
};
