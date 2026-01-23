export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    salePrice?: number | null;
    image: string;
    category: string;
    brand: string;
    stock: number;
    isBuildSet: boolean;
}