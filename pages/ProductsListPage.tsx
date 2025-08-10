import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Product, Category } from '../types';  // فرض کردم Category هم داری
import { useToast } from '../context/ToastContext';
import { EditIcon, DeleteIcon, AddIcon } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

const ProductsListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // دسته‌بندی‌ها
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // 0 یعنی همه دسته‌ها
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

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch {
      addToast('خطا در دریافت دسته‌بندی‌ها', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

const confirmDelete = async () => {
  if (!productToDelete || productToDelete.id === undefined) return;  // اینجا چک اضافه شد
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

  // فیلتر محصولات بر اساس سرچ و دسته‌بندی
const filteredProducts = products
  .filter(product => {
    const matchesSearch =
      (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.code?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryId === 0 || product.category_id === selectedCategoryId;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => (b.id || 0) - (a.id || 0));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      );
    }
  
    if (products.length === 0) {
      return (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">هیچ محصولی یافت نشد.</p>
          <button
            onClick={() => navigate('/products/add')}
            className="mt-4 text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity"
          >
            افزودن محصول جدید
          </button>
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {filteredProducts.map((product) => (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex"
    >
      <div className="flex-shrink-0 w-24 h-24 bg-gray-50 flex items-center justify-center p-2">
        <img
          src={
            product.image?.[0]
              ? product.image[0]
              : 'https://www.kasraeminence.com/wp-content/uploads/2024/12/cropped-cropped-2.png'
          }
          alt={product.name || 'product image'}
          className="max-h-full max-w-full object-contain rounded"
        />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1 min-w-0">
        <div>
          <h2
            className="text-base font-semibold text-gray-900 truncate"
            title={product.name}
          >
            {product.name || 'بدون نام'}
          </h2>
          <p
            className="text-sm text-gray-600 truncate"
            title={`کد: ${product.code}`}
          >
            کد: {product.code || '-'}
          </p>
          <div className="mt-1 text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>طول: {product.length ?? '-'}</span>
            <span>عرض: {product.width ?? '-'}</span>
            <span>ارتفاع: {product.height ?? '-'}</span>
            <span>وزن: {product.weight ?? '-'}</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm font-semibold bg-blue-100 text-blue-700 py-1 px-3 rounded-full whitespace-nowrap">
            {product.category_name || 'بدون دسته‌بندی'}
          </span>
          <p className="text-sm font-bold text-primary">
            {formatPrice(product.price_customer || 0)}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1 p-2">
        <a
          href={`#/products/edit/${product.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition"
          title="ویرایش محصول"
          aria-label="ویرایش محصول"
        >
          <EditIcon className="w-5 h-5" />
        </a>

        <button
          onClick={() => handleDeleteClick(product)}
          className="p-1 rounded-full text-red-500 hover:bg-red-100 transition"
          title="حذف محصول"
          aria-label="حذف محصول"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
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
        <div className="w-3/4 flex-grow">
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا کد محصول..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* باکس انتخاب دسته بندی */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
          >
            <option value={0}>همه دسته‌بندی‌ها</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
