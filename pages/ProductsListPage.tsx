import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { EditIcon, DeleteIcon, AddIcon } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

const ProductsListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToast();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            addToast('خطا در دریافت محصولات', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await api.deleteProduct(productToDelete.id);
            addToast('محصول با موفقیت حذف شد.', 'success');
            fetchProducts();
        } catch (error) {
            addToast('خطا در حذف محصول.', 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center mt-8"><div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div></div>;
        }

        if (products.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">هیچ محصولی یافت نشد.</p>
                    <button onClick={() => navigate('/products/add')} className="mt-4 text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity">افزودن محصول جدید</button>
                </div>
            );
        }

        if (filteredProducts.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">هیچ محصولی با این مشخصات یافت نشد.</p>
                </div>
            );
        }
        
        return (
             <div className="space-y-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img 
                            src={product.image || 'https://www.kasraeminence.com/wp-content/uploads/2024/12/cropped-cropped-2.png'} 
                            alt={product.name} 
                            className="w-full h-40 object-contain p-4 bg-gray-50" 
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-bold text-dark">{product.name}</h2>
                                    <p className="text-sm text-gray-500">کد: {product.code}</p>
                                </div>
                                <span className="text-xs font-semibold bg-blue-100 text-primary py-1 px-3 rounded-full">{product.category?.name || 'بدون دسته‌بندی'}</span>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                                <p><span className="font-semibold">قیمت همکار ۱:</span> {formatPrice(product.price1)}</p>
                                <p><span className="font-semibold">قیمت همکار ۲:</span> {formatPrice(product.price2)}</p>
                                <p><span className="font-semibold text-primary">قیمت مشتری:</span> {formatPrice(product.priceCustomer)}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2">
                                <button onClick={() => navigate(`/products/edit/${product.id}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDeleteClick(product)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark">لیست محصولات</h1>
            
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow">
                <div className="w-full flex-grow">
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام یا کد محصول..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                </div>
                <button 
                    onClick={() => navigate('/products/add')} 
                    className="w-full md:w-auto flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                    <AddIcon />
                    <span>افزودن محصول</span>
                </button>
            </div>

            {renderContent()}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="حذف محصول"
                message={`آیا از حذف محصول "${productToDelete?.name}" اطمینان دارید؟`}
            />
        </div>
    );
};

export default ProductsListPage;