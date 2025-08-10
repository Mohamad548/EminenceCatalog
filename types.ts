
export interface User {
    id: number;
    username: string;
    password?: string; // Password should not be stored or passed around
}

export interface Category {
    id: number;
    name: string;
}

export interface Product {
  [x: string]: any;  // یا string | number | undefined
  id?: number;
  name?: string;
  code?: string;
  categoryId?: number;
  category_name?: string;
  price_customer?: number;
  description?: string;
  image?: string[];
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}


export interface CredentialsUpdatePayload {
    [x: string]: any;
    userId: number;
    username: string;
    currentPassword?: string;
    newPassword?: string;
}
