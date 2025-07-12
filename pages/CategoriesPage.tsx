import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { Category } from '../types';
import { useToast } from '../context/ToastContext';
import { EditIcon, DeleteIcon } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { addToast } = useToast();

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            addToast('خطا در دریافت دسته‌بندی‌ها', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = editingCategory ? editingCategory.name : newCategoryName;
        if (!name.trim()) {
            addToast('نام دسته‌بندی نمی‌تواند خالی باشد.', 'error');
            return;
        }

        try {
            if (editingCategory) {
                await api.updateCategory(editingCategory.id, name);
                addToast('دسته‌بندی با موفقیت ویرایش شد.', 'success');
            } else {
                await api.addCategory(name);
                addToast('دسته‌بندی جدید اضافه شد.', 'success');
            }
            setNewCategoryName('');
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            addToast('عملیات با خطا مواجه شد.', 'error');
        }
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await api.deleteCategory(categoryToDelete.id);
            addToast('دسته‌بندی با موفقیت حذف شد.', 'success');
            fetchCategories();
        } catch (error) {
            addToast('خطا در حذف دسته‌بندی.', 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const startEditing = (category: Category) => {
        setEditingCategory(category);
        setNewCategoryName('');
    };

    const cancelEditing = () => {
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark">مدیریت دسته‌بندی‌ها</h1>
            
            <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
                <h2 className="text-lg font-semibold">{editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</h2>
                <input
                    type="text"
                    placeholder="نام دسته‌بندی"
                    value={editingCategory ? editingCategory.name : newCategoryName}
                    onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                />
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-gold hover:opacity-90 transition-opacity">
                        {editingCategory ? 'ذخیره تغییرات' : 'افزودن'}
                    </button>
                    {editingCategory && (
                        <button type="button" onClick={cancelEditing} className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                            انصراف
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">لیست دسته‌بندی‌ها</h2>
                {isLoading ? (
                    <p>در حال بارگذاری...</p>
                ) : categories.length === 0 ? (
                    <p>هیچ دسته‌بندی یافت نشد.</p>
                ) : (
                    <ul className="space-y-3">
                        {categories.map(category => (
                            <li key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{category.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditing(category)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDeleteClick(category)} className="p-2 text-red-500 hover:text-red-700 transition-colors">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="حذف دسته‌بندی"
                message={`آیا از حذف دسته‌بندی "${categoryToDelete?.name}" و تمام محصولات مرتبط با آن اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
            />
        </div>
    );
};

export default CategoriesPage;