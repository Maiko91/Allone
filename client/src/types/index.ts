export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    amazonUrl?: string | null;
}
