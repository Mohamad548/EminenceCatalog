import React, { useState, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { HamburgerIcon, CloseIcon, ProductsIcon, CategoryIcon, AddIcon, LogoutIcon, DashboardIcon, BackIcon } from './icons';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { to: "/dashboard", text: "داشبورد", icon: <DashboardIcon />, exact: true },
        { to: "/products", text: "مشاهده محصولات", icon: <ProductsIcon />, exact: true },
        { to: "/categories", text: "مدیریت دسته‌بندی", icon: <CategoryIcon />, exact: true },
        { to: "/products/add", text: "افزودن محصول", icon: <AddIcon />, exact: true },
    ];

    const activeLinkStyle = {
        background: 'linear-gradient(to left, #066194, #d2ab67)',
        color: 'white',
    };

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
        setIsMenuOpen(false);
    };

    const cancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="relative min-h-screen">
            <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-dark shadow-lg">
                <Link to="/">
                    <img src="https://www.kasraeminence.com/wp-content/uploads/2024/12/cropped-cropped-2.png" alt="لوگو" className="h-10" />
                </Link>
                <div className="flex items-center gap-2">
                    {location.pathname !== '/dashboard' && location.pathname !== '/' && (
                        <button onClick={() => navigate(-1)} className="text-light p-2" aria-label="Back">
                            <BackIcon />
                        </button>
                    )}
                    <button onClick={() => setIsMenuOpen(true)} className="text-light p-2">
                        <HamburgerIcon />
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`fixed top-0 right-0 h-full w-1/2 max-w-xs bg-dark shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-light text-lg font-bold">منو</h2>
                    <button onClick={() => setIsMenuOpen(false)} className="text-light p-2">
                        <CloseIcon />
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            onClick={() => setIsMenuOpen(false)}
                            style={({ isActive }) => isActive ? activeLinkStyle : {}}
                            className="flex items-center gap-4 p-3 text-light rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-4 p-3 text-light rounded-lg hover:bg-gray-700 transition-colors mt-auto"
                    >
                        <LogoutIcon />
                        <span>خروج از حساب</span>
                    </button>
                </nav>
            </aside>

            {/* Overlay */}
            {isMenuOpen && (
                <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"></div>
            )}

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={cancelLogout}
                onConfirm={confirmLogout}
                title="خروج از حساب"
                message="آیا مطمئن هستید که می‌خواهید خارج شوید؟"
            />


            <main className="p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;