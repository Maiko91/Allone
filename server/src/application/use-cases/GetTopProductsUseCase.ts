import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetTopProductsUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(filters: { category?: string; listName?: string; lang?: string; limit?: number; offset?: number }): Promise<Product[]> {
        // Here we could add business logic, e.g., validating filters, check cache, etc.
        // For now, it delegates to the repository but ensures the interface is respected.
        return this.productRepository.findAll(filters);
    }
}
