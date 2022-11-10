export interface IProductType {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    imageUrl?: string;
}

export interface ProductTypeResponse extends IProductType {
    categoryName?: string;
}

export type ProductTypeWithSlug = Pick<IProductType, 'id' | 'slug' | 'name'>;
