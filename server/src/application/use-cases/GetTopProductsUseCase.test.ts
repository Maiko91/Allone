import { GetTopProductsUseCase } from './GetTopProductsUseCase';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

// Mock Repository
const mockRepository: jest.Mocked<IProductRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('GetTopProductsUseCase', () => {
    let useCase: GetTopProductsUseCase;

    beforeEach(() => {
        useCase = new GetTopProductsUseCase(mockRepository);
        jest.clearAllMocks();
    });

    it('should return a list of products from the repository', async () => {
        // Arrange
        const expectedProducts: Product[] = [
            new Product('1', 'Test Product', 'Desc', 100, 5, 10, 'img', 'url', [], [], [])
        ];
        mockRepository.findAll.mockResolvedValue(expectedProducts);

        // Act
        const result = await useCase.execute({ category: 'Tech' });

        // Assert
        expect(mockRepository.findAll).toHaveBeenCalledWith({ category: 'Tech' });
        expect(result).toEqual(expectedProducts);
    });

    it('should pass pagination parameters correctly', async () => {
        // Act
        await useCase.execute({ limit: 10, offset: 5 });

        // Assert
        expect(mockRepository.findAll).toHaveBeenCalledWith({ limit: 10, offset: 5 });
    });
});
