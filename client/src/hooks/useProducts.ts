import { useState, useEffect, useCallback } from 'react';
import { searchProducts } from '../services/productService';
import type { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface UseProductsResult {
    products: Product[];
    loading: boolean;
    error: string | null;
    loadProducts: (query?: string, category?: string | null, list?: string | null) => Promise<void>;
}

export const useProducts = (initialCategory: string | null = null, initialList: string | null = null): UseProductsResult => {
    const { i18n } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async (query: string = '', category: string | null = initialCategory, list: string | null = initialList) => {
        setLoading(true);
        setError(null);
        try {
            // Note: searchProducts service is already decent, but logic inside component was messy.
            // We pass i18n.language here to generic service.
            const results = await searchProducts(query, category, list, i18n.language);
            setProducts(results);
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [i18n.language, initialCategory, initialList]);

    // Initial load handled by effect inside the component or here? 
    // Usually hooks for fetching data might auto-fetch or expose a method.
    // Given the previous HomePage had complex dependency tracking, exposing `loadProducts` 
    // and letting the component trigger it via useEffect is safer to avoid infinite loops if dependencies mismatch.
    // BUT, to allow "Encapsulation", we can try auto-fetch if dependencies change.

    useEffect(() => {
        loadProducts('', initialCategory, initialList);
    }, [loadProducts, initialCategory, initialList]);

    return { products, loading, error, loadProducts };
};
