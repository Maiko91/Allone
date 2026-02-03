import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import { searchProducts } from '../services/productService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the service
vi.mock('../services/productService', () => ({
    searchProducts: vi.fn()
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: { language: 'es' }
    })
}));

describe('useProducts Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial loading state', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.loading).toBe(true);
        expect(result.current.products).toEqual([]);
    });

    it('should fetch and return products successfully', async () => {
        const mockProducts = [
            { id: '1', title: 'Product 1', price: 10, description: 'desc', rating: 5, reviewCount: 1, imageUrl: 'img', categories: [], lists: [], translations: [] }
        ];
        (searchProducts as any).mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.error).toBeNull();
    });

    it('should handle errors gracefully', async () => {
        (searchProducts as any).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.products).toEqual([]);
        expect(result.current.error).toBe('Failed to load products');
    });
});
