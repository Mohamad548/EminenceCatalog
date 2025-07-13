
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'pages/api', // چون API Route های Next.js روی همین دامین هستند
});

export async function login(username: string, password: string) {
  try {
    const response = await apiClient.post('/api/login', { username, password });
    return response.data; // پاسخ موفق (کاربر) یا خطا
  } catch (error) {

    return null;
  }
}

// // --- Categories ---
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


// // --- Products ---
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
