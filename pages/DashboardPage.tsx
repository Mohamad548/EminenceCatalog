import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AddIcon, ProductsIcon, CategoryIcon, LogoutIcon } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

const DashboardPage: React.FC = () => {
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center md:text-right">
                <h1 className="text-3xl font-bold text-dark">سلام، فرزاد جان!</h1>
                <p className="text-gray-600 mt-2">
                    به پنل مدیریت کسری خوش آمدید. از اینجا می‌توانید به بخش‌های مختلف دسترسی داشته باشید.
                </p>
            </div>

            {/* Quick Access */}
            <div>
                <h2 className="text-xl font-bold text-dark mb-4 text-center md:text-right">دسترسی سریع</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickAccessCard
                        to="/products/add"
                        title="افزودن محصول"
                        icon={<AddIcon />}
                        color="blue"
                    />
                    <QuickAccessCard
                        to="/products"
                        title="مشاهده محصولات"
                        icon={<ProductsIcon />}
                        color="blue"
                    />
                    <QuickAccessCard
                        to="/categories"
                        title="مدیریت دسته‌بندی"
                        icon={<CategoryIcon />}
                        color="blue"
                    />
                    <QuickAccessCard
                        onClick={handleLogoutClick}
                        title="خروج از حساب"
                        icon={<LogoutIcon />}
                        color="red"
                    />
                </div>
            </div>

            {/* Guide Section */}
            <div>
                <h2 className="text-xl font-bold text-dark mb-4 text-center md:text-right">راهنما</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <ul className="space-y-3 list-inside">
                        <li className="text-gray-700">
                            - برای مشاهده و ویرایش محصولات موجود به بخش <strong className="text-primary">مشاهده محصولات</strong> بروید.
                        </li>
                        <li className="text-gray-700">
                            - برای اضافه کردن محصول جدید از <strong className="text-primary">افزودن محصول</strong> استفاده کنید.
                        </li>
                        <li className="text-gray-700">
                            - دسته‌بندی‌ها را می‌توانید در صفحه <strong className="text-primary">مدیریت دسته‌بندی</strong> ویرایش یا حذف نمایید.
                        </li>
                    </ul>
                </div>
                <h3 className='text-primary mt-6 text-center text-sm'>طراحی و توسعه: محمد محمودی</h3>
            </div>
            
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="خروج از حساب"
                message="آیا مطمئن هستید که می‌خواهید خارج شوید؟"
            />
        </div>
    );
};

interface QuickAccessCardProps {
    to?: string;
    onClick?: () => void;
    title: string;
    icon: React.ReactNode;
    color: 'blue' | 'red';
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ to, onClick, title, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-primary',
        red: 'bg-red-100 text-red-500'
    };
    
    const baseClasses = "bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-32 hover:shadow-xl transition-shadow duration-300 w-full";

    const content = (
        <>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                {icon}
            </div>
            <span className="mt-3 font-semibold text-gray-800">{title}</span>
        </>
    );

    if (to) {
        return <Link to={to} className={baseClasses}>{content}</Link>;
    }
    
    return <button type="button" onClick={onClick} className={baseClasses}>{content}</button>;
};


export default DashboardPage;
