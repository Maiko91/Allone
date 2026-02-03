import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Product } from '../types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../contexts/ThemeContext';

interface ProductCardProps {
    product: Product;
    rank: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
    const { t } = useTranslation();
    const { mode } = useAppTheme();
    const [expanded, setExpanded] = useState(false);
    const isLongDescription = product.description.length > 150;
    const isDark = mode === 'dark';

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'visible',
            bgcolor: isDark ? 'background.paper' : 'white',
            borderRadius: isDark ? 4 : 6,
        }}>
            {/* Rank Badge */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -12,
                    left: -12,
                    width: isDark ? 40 : 45,
                    height: isDark ? 40 : 45,
                    borderRadius: '50%',
                    bgcolor: isDark ? 'primary.main' : '#1a1a1a',
                    color: isDark ? 'black' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: isDark ? '1.1rem' : '1.2rem',
                    zIndex: 2,
                    boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 8px 15px rgba(0,0,0,0.1)',
                }}
            >
                #{rank}
            </Box>

            <Box sx={{
                position: 'relative',
                pt: 3,
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                '&::before': !isDark ? {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.03)',
                    zIndex: 0
                } : {}
            }}>
                <CardMedia
                    component={"img" as any}
                    image={product.imageUrl}
                    alt={product.title}
                    sx={{
                        height: 200,
                        width: 'auto',
                        objectFit: 'contain',
                        zIndex: 1,
                        filter: isDark ? 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' : 'none'
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, pt: 2 }}>
                <Typography gutterBottom variant="h6" sx={{
                    lineHeight: 1.3,
                    mb: 1,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: isDark ? 'white' : '#1a1a1a'
                }}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                        ({product.reviewCount} {t('reviews')})
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            display: expanded ? 'block' : '-webkit-box',
                            WebkitLineClamp: expanded ? 'unset' : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem',
                            lineHeight: 1.5
                        }}
                    >
                        {product.description}
                    </Typography>
                    {isLongDescription && (
                        <Button
                            size="small"
                            onClick={() => setExpanded(!expanded)}
                            sx={{
                                p: 0,
                                minWidth: 0,
                                textTransform: 'none',
                                fontWeight: 800,
                                color: isDark ? 'primary.main' : 'primary.main',
                                mb: 2,
                                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                            }}
                        >
                            {expanded ? t('see_less') : t('see_more')}
                        </Button>
                    )}
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2 }}>
                    <Typography variant="h5" color={isDark ? "primary.main" : "text.primary"} fontWeight={800}>
                        ${product.price}
                    </Typography>
                    <Button
                        variant="contained"
                        component="a"
                        href={product.amazonUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<ShoppingCartIcon />}
                        sx={{
                            bgcolor: isDark ? 'primary.main' : '#1a1a1a',
                            color: isDark ? 'black' : 'white',
                            fontWeight: 800,
                            borderRadius: isDark ? 2 : 4,
                            px: 3,
                            '&:hover': {
                                bgcolor: isDark ? '#b3e600' : '#333',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        {t('see_deal')}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
