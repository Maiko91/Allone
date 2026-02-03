import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { scrapeAmazonProduct } from './infrastructure/scraping/scraperService';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper for auto-translation (Placeholder for real API integration)
const handleAutoTranslate = async (text: string): Promise<string> => {
    // In a production environment, you would call a Translation API here (e.g., Google Translate, DeepL)
    // For now, we return the same text with an [EN] prefix or just the text to simulate the structure
    return `${text} (EN)`;
};

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', server: 'Allone-Backend', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', server: 'Allone-Backend', database: 'disconnected' });
    }
});

// ... imports ...
import { createProductRouter } from './infrastructure/http/routes/productRoutes';
import aiRouter from './infrastructure/http/routes/aiRoutes';

// ... app setup ...

// Mount the new Hexagonal Router for Products (Read Operations optimized)
// Note: We mount this first. The legacy handlers below for POST/PUT/DELETE can remain or be refactored.
// Since createProductRouter only handles GET '/', we need to make sure we don't block other verbs if we mount it at /api/products.
// Express routers: if a route matches path but method doesn't match, it usually calls next().
// However, to be cleaner, we can integrate the legacy handlers into a "LegacyProductController" or just standard router.
// For this step, I will replace the inline GET /api/products handler with the router mount.

const productRouter = createProductRouter(prisma);
app.use('/api/products', productRouter);
app.use('/api/ai', aiRouter);

// The POST/PUT/DELETE handlers for /api/products are currently defined as app.post('/api/products'...) below.
// Express will check the router first. If the router doesn't match the method (e.g. POST), it *should* pass through if no route matches.
// BUT, the router defines `router.get('/', ...)` and that's it. It doesn't have a catch-all.
// Let's verify: `router.get('/')` matches `/api/products/`.
// If I request `POST /api/products`, the router sees `/` and checks if it handles POST. It doesn't.
// It will send a 404 or fall through? Express 4 Router behaves nicely.
// Let's keep the legacy endpoints below but remove the old GET handler block.

// GET /api/products handler REMOVED (Replaced by productRouter)

// ... existing legacy routes ...

// GET Categories and Lists for Sidebar
app.get('/api/navigation', async (req: Request, res: Response) => {
    try {
        const { lang } = req.query;
        const currentLang = (lang as string) || 'es';

        const categories = await prisma.category.findMany({
            include: {
                lists: {
                    include: { translations: { where: { lang: currentLang } } }
                },
                translations: { where: { lang: currentLang } }
            }
        });

        const navigation: Record<string, string[]> = {};

        categories.forEach(cat => {
            const catName = cat.translations[0]?.name || cat.name;
            navigation[catName] = cat.lists.map(l => l.translations[0]?.name || l.name);
        });

        res.json(navigation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch navigation' });
    }
});
// POST Scrape Amazon URL
app.post('/api/scrape', async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const productData = await scrapeAmazonProduct(url);
        res.json(productData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new product
app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const {
            title, description, price, rating, reviewCount, imageUrl, amazonUrl,
            category: categoryName, listName,
            translations // { en: { ... }, es: { ... } }
        } = req.body;

        let finalTranslations = translations;
        if (!finalTranslations && title) {
            // Auto-generate English translation if not provided
            const enTitle = await handleAutoTranslate(title);
            const enDesc = description ? await handleAutoTranslate(description) : '';
            finalTranslations = {
                es: { title, description },
                en: { title: enTitle, description: enDesc }
            };
        }

        if (!title || !price) {
            return res.status(400).json({ error: 'Title and price are required' });
        }

        const category = await prisma.category.upsert({
            where: { name: categoryName || 'General' },
            update: {},
            create: {
                name: categoryName || 'General',
                translations: {
                    create: [
                        { lang: 'es', name: categoryName || 'General' },
                        { lang: 'en', name: await handleAutoTranslate(categoryName || 'General') }
                    ]
                }
            }
        });

        const listNameFinal = listName || 'Top 10';
        const translationData = finalTranslations ? Object.entries(finalTranslations).map(([l, data]: [string, any]) => ({
            lang: l,
            title: data.title,
            description: data.description
        })) : [];

        const newProduct = await prisma.product.create({
            data: {
                title,
                description: description || '',
                price: parseFloat(price),
                rating: parseFloat(rating) || 0,
                reviewCount: parseInt(reviewCount) || 0,
                imageUrl: imageUrl || 'https://placehold.co/600x400?text=Product',
                amazonUrl: amazonUrl || null,
                categories: { connect: { id: category.id } },
                lists: {
                    connectOrCreate: {
                        where: {
                            name_categoryId: {
                                name: listNameFinal,
                                categoryId: category.id
                            }
                        },
                        create: {
                            name: listNameFinal,
                            categoryId: category.id,
                            translations: {
                                create: [
                                    { lang: 'es', name: listNameFinal },
                                    { lang: 'en', name: await handleAutoTranslate(listNameFinal) }
                                ]
                            }
                        }
                    }
                },
                translations: {
                    create: translationData
                }
            },
            include: {
                categories: true,
                lists: true,
                translations: true
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT update product
app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const {
            title, description, price, rating, reviewCount, imageUrl, amazonUrl,
            category: categoryName, listName,
            translations
        } = req.body;

        const data: any = {
            ...(title && { title }),
            ...(description && { description }),
            ...(price && { price: parseFloat(price) }),
            ...(rating && { rating: parseFloat(rating) }),
            ...(reviewCount && { reviewCount: parseInt(reviewCount) }),
            ...(imageUrl && { imageUrl }),
            ...(amazonUrl !== undefined && { amazonUrl })
        };

        if (translations) {
            data.translations = {
                deleteMany: {},
                create: Object.entries(translations).map(([l, tData]: [string, any]) => ({
                    lang: l,
                    title: tData.title,
                    description: tData.description
                }))
            };
        }

        if (categoryName) {
            const category = await prisma.category.upsert({
                where: { name: categoryName },
                update: {},
                create: { name: categoryName }
            });

            data.categories = { set: [{ id: category.id }] };

            if (listName) {
                data.lists = {
                    set: [],
                    connectOrCreate: {
                        where: {
                            name_categoryId: { name: listName, categoryId: category.id }
                        },
                        create: { name: listName, categoryId: category.id }
                    }
                };
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data,
            include: {
                categories: true,
                lists: true,
                translations: true
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product
app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        await prisma.product.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// POST create category
app.post('/api/categories', async (req: Request, res: Response) => {
    try {
        const { name, translations } = req.body;

        let finalTranslations = translations;
        if (!finalTranslations) {
            const enName = await handleAutoTranslate(name);
            finalTranslations = {
                es: { name },
                en: { name: enName }
            };
        }

        const category = await prisma.category.create({
            data: {
                name,
                translations: {
                    create: Object.entries(finalTranslations).map(([l, data]: [string, any]) => ({
                        lang: l,
                        name: data.name
                    }))
                }
            },
            include: { translations: true }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// GET all categories
app.get('/api/categories', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                translations: true,
                _count: { select: { products: true, lists: true } }
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// PUT update category
app.put('/api/categories/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, translations } = req.body;

        const updated = await prisma.category.update({
            where: { id },
            data: {
                name,
                translations: {
                    deleteMany: {},
                    create: Object.entries(translations).map(([l, data]: [string, any]) => ({
                        lang: l,
                        name: data.name
                    }))
                }
            },
            include: { translations: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE category
app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        // Safeguard: Check if it has products? Or just let Prisma handle relations.
        // The schema doesn't have onDelete: Cascade for Category to Product.
        // We should probably disconnect or notify.
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category. Make sure it has no products or disconnect them first.' });
    }
});

// POST create list
app.post('/api/lists', async (req: Request, res: Response) => {
    try {
        const { name, categoryId, translations } = req.body;

        let finalTranslations = translations;
        if (!finalTranslations) {
            const enName = await handleAutoTranslate(name);
            finalTranslations = {
                es: { name },
                en: { name: enName }
            };
        }

        const list = await prisma.list.create({
            data: {
                name,
                categoryId,
                translations: {
                    create: Object.entries(finalTranslations).map(([l, data]: [string, any]) => ({
                        lang: l,
                        name: data.name
                    }))
                }
            },
            include: { translations: true }
        });
        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create list' });
    }
});

// GET all lists
app.get('/api/lists', async (req: Request, res: Response) => {
    try {
        const lists = await prisma.list.findMany({
            include: {
                translations: true,
                category: { include: { translations: true } },
                _count: { select: { products: true } }
            }
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
});

// PUT update list
app.put('/api/lists/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, categoryId, translations } = req.body;

        const updated = await prisma.list.update({
            where: { id },
            data: {
                name,
                categoryId,
                translations: {
                    deleteMany: {},
                    create: Object.entries(translations).map(([l, data]: [string, any]) => ({
                        lang: l,
                        name: data.name
                    }))
                }
            },
            include: { translations: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update list' });
    }
});

// DELETE list
app.delete('/api/lists/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.list.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete list.' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: PostgreSQL (Neon)`);
    console.log(`🔗 API Endpoints:`);
    console.log(`   GET    /api/health`);
    console.log(`   GET    /api/products`);
    console.log(`   GET    /api/products/:id`);
    console.log(`   POST   /api/products`);
    console.log(`   PUT    /api/products/:id`);
    console.log(`   DELETE /api/products/:id`);
});
