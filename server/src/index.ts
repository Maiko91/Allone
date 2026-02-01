import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { scrapeAmazonProduct } from './services/scraperService';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', server: 'Allone-Backend', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', server: 'Allone-Backend', database: 'disconnected' });
    }
});

// GET all products (with filters)
app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const { category, listName } = req.query;

        const products = await prisma.product.findMany({
            where: {
                ...(category && { category: category as string }),
                ...(listName && { listName: listName as string }),
            },
            orderBy: { rating: 'desc' },
            take: 100 // Aumentamos el límite para dar soporte a categorías
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET Categories and Lists for Sidebar
app.get('/api/navigation', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            select: {
                category: true,
                listName: true
            }
        });

        const navigation: Record<string, string[]> = {};

        products.forEach(p => {
            if (!navigation[p.category]) {
                navigation[p.category] = [];
            }
            if (!navigation[p.category].includes(p.listName)) {
                navigation[p.category].push(p.listName);
            }
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
        const { title, description, price, rating, reviewCount, imageUrl, amazonUrl, category, listName } = req.body;

        // Validación básica
        if (!title || !price) {
            return res.status(400).json({ error: 'Title and price are required' });
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description: description || '',
                price: parseFloat(price),
                rating: parseFloat(rating) || 0,
                reviewCount: parseInt(reviewCount) || 0,
                imageUrl: imageUrl || 'https://placehold.co/600x400?text=Product',
                amazonUrl: amazonUrl || null,
                category: category || 'General',
                listName: listName || 'Top 10'
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
        const { title, description, price, rating, reviewCount, imageUrl, amazonUrl, category, listName } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(rating && { rating: parseFloat(rating) }),
                ...(reviewCount && { reviewCount: parseInt(reviewCount) }),
                ...(imageUrl && { imageUrl }),
                ...(amazonUrl !== undefined && { amazonUrl }),
                ...(category && { category }),
                ...(listName && { listName })
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
