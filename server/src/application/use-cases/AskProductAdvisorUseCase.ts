import type { IProductRepository } from '../../domain/repositories/IProductRepository';
import { GeminiService } from '../../infrastructure/ai/GeminiService';

interface AskProductAdvisorRequest {
    query: string;
    categoryId?: number;
    listId?: number;
}

export class AskProductAdvisorUseCase {
    constructor(
        private productRepository: IProductRepository,
        private geminiService: GeminiService
    ) { }

    async execute(request: AskProductAdvisorRequest): Promise<string> {
        // Fetch relevant products from database
        const products = await this.productRepository.findAll({
            limit: 20
        });

        if (products.length === 0) {
            return 'No tenemos productos disponibles en este momento. Por favor, intenta más tarde.';
        }

        // Ask Gemini AI
        const response = await this.geminiService.askProductQuestion(
            request.query,
            products
        );

        return response;
    }
}
