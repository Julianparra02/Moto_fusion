export interface Compatibility {
    marca: string;
    modelo: string;
    year: number;
}

export interface Product {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    reference: string;
    price: number;
    categoryId: string;
    brandId: string;
    images: string[];
    isFeatured:boolean;
    isNewProduct:boolean;
    
    // INFORMACIÓN DE COMPATIBILIDAD
    marca: string;
    modelo: string;
    year: number;

    // COMPATIBILIDAD CON VARIAS MOTOS
    compatibilidad: Compatibility[];
}