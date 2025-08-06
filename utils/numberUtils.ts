// utils/numberUtils.ts

export const parseNumber = (str: string) => {
  // حذف کاما یا فاصله و تبدیل به عدد
  return Number(str.replace(/[,٬\s]/g, ''));
};

export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '';
  return num.toLocaleString('en-US'); // یا 'fa-IR' برای نمایش فارسی
};

export const handleNumberChange = <T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof T,
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  const inputVal = e.target.value;
  const numericVal = parseNumber(inputVal);

  if (inputVal === '') {
    setState((prev) => ({ ...prev, [field]: undefined }));
  } else if (!isNaN(numericVal)) {
    setState((prev) => ({ ...prev, [field]: numericVal }));
  }
};
