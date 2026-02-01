import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';
import { searchProducts } from '../services/productService';
import type { Product } from '../types';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts('');
    }, []);

    const loadProducts = async (query: string) => {
        setLoading(true);
        const results = await searchProducts(query);
        setProducts(results);
        setLoading(false);
    };

    return (
        <>
            <Hero onSearch={loadProducts} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <ProductList products={products} loading={loading} />
            </Container>
        </>
    );
}
