import React from 'react';
import { Grid, Box, Typography, Container } from '@mui/material'; // Grid is now Grid2 in v6 but commonly Grid in v5. Using Grid for compat.
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

// Note: Ensure @mui/material version supports Grid (v5) or Grid2 (v6).
// We will use standard Grid syntax which is widely compatible.

interface ProductListProps {
    products: Product[];
    loading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" textAlign="center" color="text.secondary">
                    Finding top products...
                </Typography>
            </Container>
        );
    }

    if (products.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" textAlign="center" color="text.secondary">
                    No products found. Try a different search.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Grid container spacing={4}>
                {products.map((product, index) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard product={product} rank={index + 1} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
