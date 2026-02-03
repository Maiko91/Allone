import { Product } from '../entities/Product';

export interface IProductRepository {
    findAll(filters: { category?: string; listName?: string; lang?: string; limit?: number; offset?: number }): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<void>;
}
