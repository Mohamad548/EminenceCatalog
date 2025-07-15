
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
    id: number;
    image: string; // URL or base64
    code: string;
    name: string;
    categoryId: number;
    price1: number;
    price2: number;
    priceCustomer: number;
    description: string;
    category_name?:string
    category?: Category; // For expanded data
}

export interface CredentialsUpdatePayload {
    [x: string]: any;
    userId: number;
    username: string;
    currentPassword?: string;
    newPassword?: string;
}
