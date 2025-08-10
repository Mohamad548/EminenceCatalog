import React from 'react';
import { ImagePlusIcon, XCircleIcon } from '@/components/icons';

interface Props {
  previews: string[]; // ترکیب همه پیش‌نمایش‌ها (URL و base64)
  onRemove: (index: number) => void; // حذف عکس با ایندکس
  onAddFiles: (files: File[]) => void; // افزودن فایل‌های جدید
}

const ImageUploader: React.FC<Props> = ({ previews, onRemove, onAddFiles }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    onAddFiles(files);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">تصاویر محصول</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative h-40 w-full">
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="w-full h-full object-contain rounded-xl shadow-md"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow-lg"
              aria-label="Remove image"
            >
              <XCircleIcon />
            </button>
          </div>
        ))}
      </div>
      <label
        htmlFor="image-upload-input"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <ImagePlusIcon />
        <p className="mt-4 text-lg font-semibold text-gray-700">تصاویر محصول را انتخاب کنید</p>
        <p className="text-sm text-gray-500">PNG, JPG, WEBP - حداکثر ۵ مگابایت</p>
        <input
          id="image-upload-input"
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
