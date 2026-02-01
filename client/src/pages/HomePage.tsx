import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';
import { Sidebar } from '../components/Sidebar';
import { searchProducts } from '../services/productService';
import type { Product } from '../types';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeList, setActiveList] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProducts(searchQuery, activeCategory, activeList);
    }, [activeCategory, activeList]);

    const loadProducts = async (query: string, category: string | null = null, list: string | null = null) => {
        setLoading(true);
        setSearchQuery(query);
        const results = await searchProducts(query, category, list);
        setProducts(results);
        setLoading(false);
    };

    const handleNavigationSelect = (category: string | null, list: string | null) => {
        setActiveCategory(category);
        setActiveList(list);
    };

    return (
        <>
            <Hero onSearch={(q) => loadProducts(q, activeCategory, activeList)} />
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
                        <Sidebar
                            onSelect={handleNavigationSelect}
                            activeCategory={activeCategory}
                            activeList={activeList}
                        />
                    </Grid>

                    {/* Content */}
                    <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                                {activeList || activeCategory || 'Todos los Productos'}
                            </Typography>
                            {(activeCategory || activeList) && (
                                <Typography variant="body1" color="text.secondary">
                                    Mostrando lo mejor de {activeList || activeCategory}
                                </Typography>
                            )}
                        </Box>
                        <ProductList products={products} loading={loading} />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
