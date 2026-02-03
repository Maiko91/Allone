import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../../database/PrismaProductRepository';
import { GeminiService } from '../../ai/GeminiService';
import { AskProductAdvisorUseCase } from '../../../application/use-cases/AskProductAdvisorUseCase';
import { AIAdvisorController } from '../controllers/AIAdvisorController';

const router = Router();
const prisma = new PrismaClient();

// Initialize dependencies
const productRepository = new PrismaProductRepository(prisma);
const geminiService = new GeminiService();
const askProductAdvisorUseCase = new AskProductAdvisorUseCase(
    productRepository,
    geminiService
);
const aiAdvisorController = new AIAdvisorController(askProductAdvisorUseCase);

// Routes
router.post('/ask', (req, res) => aiAdvisorController.ask(req, res));

export default router;
