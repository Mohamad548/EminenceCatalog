import { useToast } from '@/context/ToastContext';
import { Category, Product } from '@/types';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploader from './components/ImageUploader';
import FormInputs from './components/FormInputs';
import DimensionSection from './components/DimensionSection';
import PriceSection from './components/PriceSection';
import * as api from '../../services/api';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    code: '',
    description: '',
    categoryId: undefined,
    category_name: '',
    length: undefined,
    width: undefined,
    height: undefined,
    weight: undefined,
    price_customer: undefined,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // تصاویر قبلی
  const [isLoading, setIsLoading] = useState(false);
  const [combinedPreviews, setCombinedPreviews] = useState<string[]>([]);
console.log('selectedFiles',selectedFiles)
  const selectedCategory = categories.find((cat) => cat.id === product.categoryId);

  const fetchProductData = useCallback(async () => {
    if (isEditMode && id) {
      setIsLoading(true);
      try {
        const fetched = await api.getProductById(Number(id));
        if (fetched) {
          setProduct(fetched);

      if (fetched.image && Array.isArray(fetched.image)) {
  setImagePreviews(fetched.image);
  setExistingImages(fetched.image);
} else {
  setImagePreviews([]);
  setExistingImages([]);
}
        } else {
          addToast('محصول یافت نشد.', 'error');
          navigate('/products');
        }
      } catch (error) {
        addToast('خطا در دریافت محصول.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, isEditMode, navigate, addToast]);

  useEffect(() => {
    // ساخت base64 برای selectedFiles و اضافه کردن existingImages
    const generatePreviews = async () => {
      const filesPreviews = await Promise.all(
        selectedFiles.map(file => 
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
        )
      );
      setCombinedPreviews([...existingImages, ...filesPreviews]);
    };

    generatePreviews();
  }, [existingImages, selectedFiles]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
      if (!isEditMode && data.length > 0) {
        setProduct((p) => ({ ...p, categoryId: data[0].id }));
      }
    } catch {
      addToast('خطا در دریافت دسته‌بندی‌ها', 'error');
    }
  }, [addToast, isEditMode]);

  useEffect(() => {
    fetchProductData();
    fetchCategories();
  }, [fetchProductData, fetchCategories]);

  // جلوگیری از اضافه شدن فایل تکراری
  const handleAddFiles = (files: File[]) => {
    setSelectedFiles(prev => {
      const existingFilesMap = new Map(prev.map(f => [f.name + f.size, true]));
      const newFiles = files.filter(f => !existingFilesMap.has(f.name + f.size));
      return [...prev, ...newFiles];
    });
  };

  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      // حذف از تصاویر قبلی
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // حذف از فایل‌های جدید
      const fileIndex = index - existingImages.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!product.name || !product.code || !product.categoryId) {
    addToast('فیلدهای ستاره‌دار الزامی هستند.', 'error');
    return;
  }

  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append('name', product.name || '');
    formData.append('code', product.code || '');
    formData.append('categoryId', product.categoryId?.toString() || '');
    formData.append('category_name', selectedCategory?.name || '');
    ['length', 'width', 'height', 'weight', 'price_customer'].forEach((key) => {
      const value = product[key as keyof Product];
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('description', product.description || '');

    // فایل‌های جدید
    selectedFiles.forEach((file) => {
      formData.append('images', file); // توجه کن نام فیلد 'images' باشه (چون در multer این نام را استفاده کردی)
    });

    // ارسال آرایه existingImages به صورت JSON رشته شده
    formData.append('existingImages', JSON.stringify(existingImages));

    // لاگ فرم دیتا برای دیباگ
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, value.type, value.size, 'bytes');
      } else {
        console.log(key, value);
      }
    }

    if (isEditMode && id) {
      await api.updateProduct(Number(id), formData);
    } else {
      await api.addProduct(formData);
    }

    addToast(isEditMode ? 'ویرایش موفق' : 'افزودن موفق', 'success');
    navigate('/products');
  } catch {
    addToast('عملیات با خطا مواجه شد.', 'error');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">{isEditMode ? 'ویرایش محصول' : 'افزودن محصول'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <ImageUploader
          previews={combinedPreviews}
          onRemove={handleRemoveImage}
          onAddFiles={handleAddFiles}
        />
        <FormInputs
          product={product}
          setProduct={setProduct}
          categories={categories}
        />
        <DimensionSection product={product} setProduct={setProduct} />
        <PriceSection product={product} setProduct={setProduct} />

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
