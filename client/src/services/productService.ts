import type { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const searchProducts = async (query: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
