
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProductsListPage from './pages/ProductsListPage';
import ProductFormPage from './pages/ProductFormPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';

import Layout from './components/Layout';
import Toast from './components/Toast';
import SettingsPage from './pages/URL/SettingsPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                <ThemeProvider>
                    <div className="bg-gray-100 min-h-screen text-dark">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Navigate to="/dashboard" replace />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <DashboardPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/products"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <ProductsListPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/products/add"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <ProductFormPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/products/edit/:id"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <ProductFormPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                             <Route
                                path="/categories"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <CategoriesPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <SettingsPage />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        <Toast />
                    </div>
                </ThemeProvider>
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
