import { Request, Response } from 'express';
import { GetTopProductsUseCase } from '../../../application/use-cases/GetTopProductsUseCase';

export class ProductController {
    constructor(private getTopProductsUseCase: GetTopProductsUseCase) { }

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const { category, listName, lang, limit, offset } = req.query;

            const products = await this.getTopProductsUseCase.execute({
                category: category as string,
                listName: listName as string,
                lang: lang as string,
                limit: limit ? parseInt(limit as string) : 20, // Default to 20 for performance (was 100)
                offset: offset ? parseInt(offset as string) : 0
            });

            res.json(products);
        } catch (error) {
            console.error('Error in ProductController:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
}
