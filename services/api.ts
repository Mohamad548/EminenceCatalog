
import axios from 'axios';
import { User, Category, Product } from '../types';

// This client assumes you are running json-server on localhost port 3001.
// Run `npx json-server --watch db.json --port 3001` in your project root.
const apiClient = axios.create({
  baseURL: '/api',  // فقط مسیر نسبی به API Routes
});

// // --- Auth ---
// export const login = async (username: string, password: string): Promise<User | null> => {
//     try {
//         // json-server doesn't have a real auth system.
//         // We'll mimic the old logic by fetching the user that matches both username and password.
//         const response = await apiClient.get<User[]>(`/users?username=${username}&password=${password}`);
//         if (response.data && response.data.length > 0) {
//             const { password, ...userWithoutPassword } = response.data[0];
//             return userWithoutPassword;
//         }
//         return null;
//     } catch (error) {
//         console.error('Login API error:', error);
//         // In case of network error or server down, also return null
//         return null;
//     }
// };
export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await apiClient.post<User>('/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    return null;
  }
};


// --- Categories ---
// export const getCategories = async (): Promise<Category[]> => {
//     const response = await apiClient.get<Category[]>('/categories');
//     return response.data;
// };

// export const addCategory = async (name: string): Promise<Category> => {
//     const response = await apiClient.post<Category>('/categories', { name });
//     return response.data;
// };

// export const updateCategory = async (id: number, name: string): Promise<Category> => {
//     const response = await apiClient.patch<Category>(`/categories/${id}`, { name });
//     return response.data;
// };

// export const deleteCategory = async (id: number): Promise<boolean> => {
//     // Replicate original logic: delete associated products first.
//     const productsResponse = await apiClient.get<Product[]>(`/products?categoryId=${id}`);
//     const productsToDelete = productsResponse.data;
    
//     // Use Promise.all to delete them in parallel for efficiency.
//     await Promise.all(productsToDelete.map(p => apiClient.delete(`/products/${p.id}`)));

//     // Then, delete the category itself.
//     await apiClient.delete(`/categories/${id}`);
//     return true; // axios throws on non-2xx status, so if we reach here, it was successful.
// };

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

export const addCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', { name });
  return response.data;
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  const response = await apiClient.put<Category>(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  await apiClient.delete(`/categories/${id}`);
  return true;
};

// --- Products ---
// export const getProducts = async (): Promise<Product[]> => {
//     // Use json-server's _expand feature to include category data, just like the original function did.
//     const response = await apiClient.get<Product[]>('/products');
//     return response.data;
// };


// export const getProductById = async (id: number): Promise<Product | null> => {
//     try {
//         const response = await apiClient.get<Product>(`/products/${id}`);
//         return response.data;
//     } catch (error) {
//         // If axios throws an error (e.g., 404 Not Found), return null.
//         return null;
//     }
// };

// export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
//     const response = await apiClient.post<Product>('/products', productData);
//     return response.data;
// };

// export const updateProduct = async (id: number, productData: Partial<Omit<Product, 'id'>>): Promise<Product | null> => {
//     const response = await apiClient.patch<Product>(`/products/${id}`, productData);
//     return response.data;
// };

// export const deleteProduct = async (id: number): Promise<boolean> => {
//     await apiClient.delete(`/products/${id}`);
//     return true; // Success if no error is thrown.
// };
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products');
  return response.data;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await apiClient.post<Product>('/products', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product | null> => {
  const response = await apiClient.put<Product>(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  await apiClient.delete(`/products/${id}`);
  return true;
};
