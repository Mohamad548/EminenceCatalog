import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/api';
import { Product, Category } from '../types';
import { useToast } from '../context/ToastContext';
import { ImagePlusIcon, XCircleIcon } from '../components/icons';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
   const [categories, setCategories] = useState<Category[]>([]);
  const selectedCategory = categories.find(
    (cat) => cat.id === product.categoryId
  );
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    code: '',
    categoryId: undefined,
    price1: 0,
    price2: 0,
    priceCustomer: 0,
    description: '',
    image: '',
    category_name:''
  });
 
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const inputStyle =
    'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300';
  const labelStyle = 'block text-sm font-semibold text-gray-700 mb-2';

  const fetchProductData = useCallback(async () => {
    if (isEditMode && id) {
      setIsLoading(true);
      try {
        const fetchedProduct = await api.getProductById(Number(id));
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.image) setImagePreview(fetchedProduct.image);
        } else {
          addToast('محصول مورد نظر یافت نشد.', 'error');
          navigate('/products');
        }
      } catch (error) {
        addToast('خطا در دریافت اطلاعات محصول.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, isEditMode, navigate, addToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
      if (!isEditMode && data.length > 0) {
        setProduct((p) => ({ ...p, categoryId: data[0].id }));
      }
    } catch (error) {
      addToast('خطا در دریافت دسته‌بندی‌ها', 'error');
    }
  }, [addToast, isEditMode]);

  useEffect(() => {
    fetchProductData();
    fetchCategories();
  }, [fetchProductData, fetchCategories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name.startsWith('price') || name === 'categoryId'
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // برای نمایش پیش‌نمایش عکس
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setProduct((prev) => ({ ...prev, image: '' }));
    const fileInput = document.getElementById(
      'image-upload-input'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.code || !product.categoryId) {
      addToast('لطفاً همه فیلدهای ستاره‌دار را پر کنید.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', product.name || '');
      formData.append('code', product.code || '');
      formData.append('categoryId', product.categoryId?.toString() || '');
      formData.append('category_name', selectedCategory?.name || '');
      formData.append('price1', (product.price1 || 0).toString());
      formData.append('price2', (product.price2 || 0).toString());
      formData.append('priceCustomer', (product.priceCustomer || 0).toString());
      formData.append('description', product.description || '');

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (isEditMode && id) {
        await api.updateProduct(Number(id), formData);
        addToast('محصول با موفقیت ویرایش شد.', 'success');
      } else {
        await api.addProduct(formData);
        addToast('محصول با موفقیت اضافه شد.', 'success');
      }

      navigate('/products');
    } catch (error) {
      addToast('عملیات با خطا مواجه شد.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center mt-8">
        <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">
        {isEditMode ? 'ویرایش محصول' : 'افزودن محصول جدید'}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-6"
      >
        <div className="col-span-1 md:col-span-2">
          <label className={labelStyle}>تصویر محصول</label>
          {imagePreview ? (
            <div className="mt-2 relative w-full h-64 sm:w-80 sm:h-80 mx-auto">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow-lg transition-transform hover:scale-110"
                aria-label="Remove image"
              >
                <XCircleIcon />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-upload-input"
              className="mt-2 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <ImagePlusIcon />
                <p className="mt-4 text-lg font-semibold text-gray-700">
                  تصویر محصول را اینجا بکشید و رها کنید
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  یا برای انتخاب کلیک کنید
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  PNG, JPG, WEBP (حداکثر 5 مگابایت)
                </p>
              </div>
              <input
                id="image-upload-input"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4 border-t">
          <div>
            <label className={labelStyle}>نام محصول *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>کد محصول *</label>
            <input
              type="text"
              name="code"
              value={product.code}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>دسته‌بندی *</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="">انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 pt-4">
            <h3 className="text-lg font-bold text-dark border-b pb-2 mb-4">
              اطلاعات قیمت
            </h3>
          </div>

          <div>
            <label className={labelStyle}>قیمت همکار ۱</label>
            <input
              type="number"
              name="price1"
              value={product.price1}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>قیمت همکار ۲</label>
            <input
              type="number"
              name="price2"
              value={product.price2}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>قیمت مشتری</label>
            <input
              type="number"
              name="priceCustomer"
              value={product.priceCustomer}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <label className={labelStyle}>توضیحات</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={5}
              className={inputStyle}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200 justify-end">
          {isEditMode && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="w-full sm:w-auto text-center px-8 py-3 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              انصراف
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex-1 sm:w-auto flex justify-center items-center text-white font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : isEditMode ? (
              'ذخیره تغییرات'
            ) : (
              'افزودن محصول'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
