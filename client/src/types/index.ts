export interface Category {
    id: string;
    name: string;
}

export interface List {
    id: string;
    name: string;
    categoryId: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    amazonUrl?: string | null;
    categories: Category[];
    lists: List[];
}
