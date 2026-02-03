export class Product {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public price: number,
        public rating: number,
        public reviewCount: number,
        public imageUrl: string,
        public amazonUrl: string | null,
        public categories?: any[],
        public lists?: any[],
        public translations?: any[]
    ) { }
}
