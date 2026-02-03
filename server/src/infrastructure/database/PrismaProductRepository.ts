import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

export class PrismaProductRepository implements IProductRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(filters: { category?: string; listName?: string; lang?: string; limit?: number; offset?: number }): Promise<Product[]> {
        const { category, listName, lang, limit = 20, offset = 0 } = filters;
        const currentLang = lang || 'es';

        const products = await this.prisma.product.findMany({
            where: {
                AND: [
                    category ? {
                        categories: {
                            some: {
                                OR: [
                                    { name: category },
                                    { translations: { some: { name: category } } }
                                ]
                            }
                        }
                    } : {},
                    listName ? {
                        lists: {
                            some: {
                                OR: [
                                    { name: listName },
                                    { translations: { some: { name: listName } } }
                                ]
                            }
                        }
                    } : {}
                ]
            },
            include: {
                categories: {
                    include: { translations: { where: { lang: currentLang } } }
                },
                lists: {
                    include: { translations: { where: { lang: currentLang } } }
                },
                translations: {
                    where: { lang: currentLang }
                }
            },
            orderBy: { rating: 'desc' },
            take: limit,
            skip: offset
        });

        // Map Prisma result to Domain Entity (and handle translation logic here or in use case? 
        // Ideally Repository returns Domain Objects. The Translation mapping is arguably Business Logic or Presentation Logic.
        // For now, let's keep the mapping logic here to return "ready to use" entities as per the original behavior)

        return products.map(p => {
            // Basic mapping, specific translation handling can be refined
            const title = p.translations[0]?.title || p.title;
            const description = p.translations[0]?.description || p.description;

            return new Product(
                p.id,
                title,
                description,
                p.price,
                p.rating,
                p.reviewCount,
                p.imageUrl,
                p.amazonUrl,
                p.categories,
                p.lists,
                p.translations
            );
        });
    }

    async findById(id: string): Promise<Product | null> {
        const p = await this.prisma.product.findUnique({
            where: { id },
            include: { categories: true, lists: true, translations: true }
        });
        if (!p) return null;
        return new Product(p.id, p.title, p.description, p.price, p.rating, p.reviewCount, p.imageUrl, p.amazonUrl, p.categories, p.lists, p.translations);
    }

    async create(product: Product): Promise<Product> {
        // Implementation for create would act similarly, transforming Domain Product to Prisma Input
        // For brevity in this step, focusing on Read mostly as per performance request
        throw new Error('Method not implemented.');
    }

    async update(id: string, product: Partial<Product>): Promise<Product> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({ where: { id } });
    }
}
