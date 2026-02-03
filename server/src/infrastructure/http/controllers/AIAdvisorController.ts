import { Request, Response } from 'express';
import { AskProductAdvisorUseCase } from '../../application/use-cases/AskProductAdvisorUseCase';

export class AIAdvisorController {
    constructor(private askProductAdvisorUseCase: AskProductAdvisorUseCase) { }

    async ask(req: Request, res: Response): Promise<void> {
        try {
            const { query, categoryId, listId } = req.body;

            if (!query || typeof query !== 'string') {
                res.status(400).json({ error: 'Query is required and must be a string' });
                return;
            }

            if (query.length > 500) {
                res.status(400).json({ error: 'Query is too long (max 500 characters)' });
                return;
            }

            const response = await this.askProductAdvisorUseCase.execute({
                query,
                categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
                listId: listId ? parseInt(listId, 10) : undefined
            });

            res.json({ response });
        } catch (error) {
            console.error('AI Advisor error:', error);
            res.status(500).json({
                error: 'Failed to get AI response. Please try again later.'
            });
        }
    }
}
