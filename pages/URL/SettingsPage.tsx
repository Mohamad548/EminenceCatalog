import React, { useState } from 'react';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {updateUserCredentials } from '@/services/api';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const { user, logout, updateUserInContext } = useAuth();

  const [credentials, setCredentials] = useState({
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThemeChange = (field: string, value: string) => {
    setTheme({ [field]: value });
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // اعتبارسنجی رمز عبور جدید
    if (
      credentials.newPassword &&
      credentials.newPassword !== credentials.confirmNewPassword
    ) {
      addToast('رمز عبور جدید و تکرار آن یکسان نیستند.', 'error');
      return;
    }

    // بررسی اینکه اگر رمز جدید وارد شده، رمز فعلی هم باید وارد شود
    if (credentials.newPassword && !credentials.currentPassword) {
      addToast('برای تغییر رمز عبور، وارد کردن رمز فعلی الزامی است.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // ساختن payload برای ارسال به API
      const payload = {
        userId: user.id,
        username: credentials.username,
        ...(credentials.newPassword && {
          newPassword: credentials.newPassword,
        }),
        ...(credentials.currentPassword && {
          currentPassword: credentials.currentPassword,
        }),
      };

      // ارسال درخواست به API برای بروزرسانی
      const updatedUser = await updateUserCredentials(payload);

      if (updatedUser) {
        updateUserInContext(updatedUser);

        if (payload.newPassword) {
          addToast(
            'اطلاعات با موفقیت بروزرسانی شد. لطفاً با اطلاعات جدید وارد شوید.',
            'success'
          );
          logout(); // کاربر را خارج می‌کنیم چون رمز عوض شده
        } else {
          addToast('نام کاربری با موفقیت بروزرسانی شد.', 'success');
          
        }
      }
    } catch (error) {
      addToast('بروزرسانی اطلاعات با خطا مواجه شد.', 'error');

    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    'w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300';
  const labelStyle = 'block text-sm font-semibold text-gray-700 mb-2';

  const availableFonts = [
    { value: 'IRANSansFaNum', label: 'ایران سنس' },
    { value: 'Vazirmatn', label: 'وزیرمتن' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-dark">تنظیمات</h1>

      {/* Appearance Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-bold text-dark border-b pb-3 mb-4">
          تنظیمات ظاهری
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>رنگ اصلی</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) =>
                  handleThemeChange('primaryColor', e.target.value)
                }
                className="w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-gray-600 font-mono">
                {theme.primaryColor}
              </span>
            </div>
          </div>
          <div>
            <label className={labelStyle}>رنگ طلایی (گرادینت)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.goldColor}
                onChange={(e) => handleThemeChange('goldColor', e.target.value)}
                className="w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-gray-600 font-mono">{theme.goldColor}</span>
            </div>
          </div>
          <div>
            <label htmlFor="font-family-select" className={labelStyle}>
              فونت برنامه
            </label>
            <select
              id="font-family-select"
              value={theme.fontFamily}
              onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
              className={inputStyle}
            >
              {availableFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-bold text-dark border-b pb-3 mb-4">
          تنظیمات حساب کاربری
        </h2>
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={labelStyle}>
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleCredentialsChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="currentPassword" className={labelStyle}>
              رمز عبور فعلی (برای تغییر رمز)
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={credentials.currentPassword}
              onChange={handleCredentialsChange}
              className={inputStyle}
              placeholder="برای تغییر رمز وارد کنید"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelStyle}>
              رمز عبور جدید
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={credentials.newPassword}
              onChange={handleCredentialsChange}
              className={inputStyle}
              placeholder="خالی بگذارید اگر قصد تغییر ندارید"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={labelStyle}>
              تکرار رمز عبور جدید
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={credentials.confirmNewPassword}
              onChange={handleCredentialsChange}
              className={inputStyle}
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex justify-center items-center text-white font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
