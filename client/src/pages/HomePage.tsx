import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Skeleton } from '@mui/material';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';
import { Sidebar } from '../components/Sidebar';
import { useProducts } from '../hooks/useProducts';
import { useTranslation } from 'react-i18next';

export function HomePage() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeList, setActiveList] = useState<string | null>(null);
    const { products, loading, loadProducts } = useProducts(activeCategory, activeList);

    // SEO: Actualizar Título y Meta Descripción dinámicamente
    useEffect(() => {
        const title = activeList || activeCategory || t('all_products');
        document.title = `${title} | AllOne - Ranking Top 10`;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', t('meta_description', { title }));
        }
    }, [activeCategory, activeList, t]);

    // SEO: Inyectar JSON-LD
    useEffect(() => {
        if (!products.length) return;
        const scriptId = 'json-ld-products';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": activeList || activeCategory || "Top Productos",
            "itemListElement": products.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.title,
                    "description": product.description,
                    "image": product.imageUrl,
                    "url": window.location.href,
                    "offers": {
                        "@type": "Offer",
                        "price": product.price,
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": product.rating,
                        "reviewCount": product.reviewCount
                    }
                }
            }))
        };

        script.text = JSON.stringify(jsonLd);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) existingScript.remove();
        };
    }, [products, activeCategory, activeList]);

    const handleNavigationSelect = (category: string | null, list: string | null) => {
        setActiveCategory(category);
        setActiveList(list);
    };

    const handleSearch = (query: string) => {
        loadProducts(query, activeCategory, activeList);
    };

    return (
        <>
            <Hero onSearch={handleSearch} />
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
                            <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', mb: 1 }}>
                                {activeList || activeCategory || t('all_products')}
                            </Typography>
                            {(activeCategory || activeList) && (
                                <Typography variant="body1" color="text.secondary">
                                    {t('category_description', { category: activeList || activeCategory })}
                                </Typography>
                            )}
                        </Box>

                        {loading ? (
                            <Grid container spacing={3}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
                                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
                                        <Skeleton variant="text" height={30} width="80%" />
                                        <Skeleton variant="text" height={20} width="60%" />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <ProductList products={products} loading={loading} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
