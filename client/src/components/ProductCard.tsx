import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    rank: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
            {/* Rank Badge */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -12,
                    left: -12,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    zIndex: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                }}
            >
                #{rank}
            </Box>

            <CardMedia
                component={"img" as any}
                image={product.imageUrl}
                alt={product.title}
                sx={{
                    height: 240,
                    objectFit: 'contain',
                    p: 2,
                    bgcolor: '#fff', // White background for product images to pop
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography gutterBottom variant="h6" sx={{ lineHeight: 1.2, mb: 1 }}>
                    {product.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                        value={product.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviewCount} reviews)
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                        ${product.price}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ShoppingCartIcon />}
                        sx={{
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#b3e600' }
                        }}
                    >
                        See Deal
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
