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

// GET all products
app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { rating: 'desc' },
            take: 10
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product by ID
app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
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
        const { title, description, price, rating, reviewCount, imageUrl, amazonUrl } = req.body;

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
                amazonUrl: amazonUrl || null
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
        const { title, description, price, rating, reviewCount, imageUrl, amazonUrl } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(rating && { rating: parseFloat(rating) }),
                ...(reviewCount && { reviewCount: parseInt(reviewCount) }),
                ...(imageUrl && { imageUrl }),
                ...(amazonUrl !== undefined && { amazonUrl })
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
