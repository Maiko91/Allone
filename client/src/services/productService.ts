import type { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const searchProducts = async (query: string = '', category: string | null = null, listName: string | null = null): Promise<Product[]> => {
    try {
        let url = `${API_URL}/products?q=${encodeURIComponent(query)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (listName) url += `&listName=${encodeURIComponent(listName)}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
