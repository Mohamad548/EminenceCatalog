import React from 'react';
import { formatNumber, handleNumberChange } from '@/utils/numberUtils';
import { Product } from '@/types';
interface Props {
  product: Partial<Product>;
  setProduct: (cb: (prev: any) => any) => void;
}
const inputStyle = 'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg';
const labelStyle = 'block text-sm font-semibold text-gray-700 mb-2';

const DimensionSection: React.FC<Props> = ({ product, setProduct }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 pt-4">
        <h3 className="text-lg font-bold text-dark border-b pb-2 mb-4">ابعاد</h3>
      </div>
      <div>
        <label className={labelStyle}>طول (cm)</label>
        <input
          type="text"
          name="length"
          value={formatNumber(product.length)}
          onChange={(e) => handleNumberChange(e, 'length', setProduct)}
          className={inputStyle}
        />
      </div>
      <div>
        <label className={labelStyle}>عرض (cm)</label>
        <input
          type="text"
          name="width"
          value={formatNumber(product.width)}
          onChange={(e) => handleNumberChange(e, 'width', setProduct)}
          className={inputStyle}
        />
      </div>
      <div>
        <label className={labelStyle}>ارتفاع (cm)</label>
        <input
          type="text"
          name="height"
          value={formatNumber(product.height)}
          onChange={(e) => handleNumberChange(e, 'height', setProduct)}
          className={inputStyle}
        />
      </div>
      <div>
        <label className={labelStyle}>وزن (kg)</label>
        <input
          type="text"
          name="weight"
          value={formatNumber(product.weight)}
          onChange={(e) => handleNumberChange(e, 'weight', setProduct)}
          className={inputStyle}
        />
      </div>
    </div>
  );
};

export default DimensionSection;