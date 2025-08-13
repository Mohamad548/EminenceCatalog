import { Product } from '@/types';
import { formatNumber, handleNumberChange } from '@/utils/numberUtils';
import React from 'react';

interface Props {
  product: Partial<Product>;
  setProduct: (cb: (prev: any) => any) => void;
}

const inputStyle = 'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg';
const labelStyle = 'block text-sm font-semibold text-gray-700 mb-2';

const PriceSection: React.FC<Props> = ({ product, setProduct }) => {
  return (
    <div>
      <div className="md:col-span-2 pt-4">
        <h3 className="text-lg font-bold text-dark border-b pb-2 mb-4">
          اطلاعات قیمت
        </h3>
      </div>

      <div>
        <label className={labelStyle}>قیمت مشتری</label>
        <input
          type="text"
          name="price_customer" // ✅ هماهنگ با state
          value={formatNumber(product.price_customer)}
          onChange={(e) => handleNumberChange(e, 'price_customer', setProduct)}
          className={inputStyle}
        />
      </div>
    </div>
  );
};

export default PriceSection;
