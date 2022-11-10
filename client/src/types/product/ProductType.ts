export interface ProductType {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    categoryName?: string;
    imageUrl?: string;
    group?: [];
}

export type ProductTypeWithSlug = Pick<ProductType, 'id' | 'slug' | 'name'>;
