
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            addToast('نام کاربری و رمز عبور الزامی است.', 'error');
            return;
        }
        const success = await login(username, password);
        if (success) {
            addToast('ورود با موفقیت انجام شد.', 'success');
            navigate('/');
        } else {
            addToast('نام کاربری یا رمز عبور اشتباه است.', 'error');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <img src="https://www.kasraeminence.com/wp-content/uploads/2024/12/cropped-cropped-2.png" alt="لوگو" className="h-20" />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h1 className="text-2xl font-bold text-center text-dark mb-6">ورود به پنل مدیریت</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                                placeholder="مثال: admin"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            ) : 'ورود'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
