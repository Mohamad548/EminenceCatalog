import { ImagePlusIcon, XCircleIcon } from '@/components/icons';
import React from 'react';


interface Props {
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setProduct: (cb: (prev: any) => any) => void;
}


const ImageUploader: React.FC<Props> = ({ imagePreviews, setImagePreviews, setSelectedFiles }) => {
// تغییر این قسمت در ImageUploader.tsx

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);

    setSelectedFiles((prevFiles: File[]) => [...prevFiles, ...files]);

    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      setImagePreviews((prevPreviews: string[]) => [...prevPreviews, ...images]);
    });
  }
};


  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">تصاویر محصول</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative h-40 w-full">
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="w-full h-full object-contain rounded-xl shadow-md"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
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