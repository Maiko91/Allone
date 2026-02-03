import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../../database/PrismaProductRepository';
import { GetTopProductsUseCase } from '../../../application/use-cases/GetTopProductsUseCase';

const router = Router();
const prisma = new PrismaClient(); // Shared instance or injected dependency? Ideally shared.
// For simplicity in this refactor step, we instantiate here. In a real DI container (InversifyJS or NestJS), this is handled better.
// We should probably export a factory function or use the main prisma instance passed from app.

export const createProductRouter = (prismaClient: PrismaClient) => {
    const productRepository = new PrismaProductRepository(prismaClient);
    const getTopProductsUseCase = new GetTopProductsUseCase(productRepository);
    const productController = new ProductController(getTopProductsUseCase);

    const router = Router();

    router.get('/', (req, res) => productController.getProducts(req, res));

    // We can add other routes here later (create, update, delete)

    return router;
};
