import { Category, Product } from '@/types';
import React from 'react';

interface Props {
  product: Partial<Product>;
  setProduct: (cb: (prev: any) => any) => void;
  categories: Category[];
}

const inputStyle = 'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg';
const labelStyle = 'block text-sm font-semibold text-gray-700 mb-2';

const FormInputs: React.FC<Props> = ({ product, setProduct, categories }) => {
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    if (name === 'categoryId') {
      const catId = Number(value);
      const selectedCat = categories.find((c) => c.id === catId);
      setProduct((prev) => ({
        ...prev,
        categoryId: catId,
        category_name: selectedCat?.name || '',
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelStyle}>نام محصول *</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} className={inputStyle} required />
      </div>
      <div>
        <label className={labelStyle}>کد محصول *</label>
        <input type="text" name="code" value={product.code} onChange={handleChange} className={inputStyle} required />
      </div>
      <div>
        <label className={labelStyle}>دسته‌بندی *</label>
        <select name="categoryId" value={product.categoryId?.toString() || ''} onChange={handleChange} className={inputStyle} required>
          <option value="">انتخاب کنید</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className={labelStyle}>توضیحات</label>
        <textarea name="description" value={product.description} onChange={handleChange} className={inputStyle} rows={4}></textarea>
      </div>
    </div>
  );
};

export default FormInputs;
