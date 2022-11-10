export enum SellType {
    SellOnline = 'SellOnline',
    SellOffline = 'SellOffline',
}

export interface Category {
    id: string;
    code: string;
    name: string;
    slug: string;
    type: SellType;
    imageUrl?: string;
}

export type CategoryWithSlug = Pick<Category, 'id' | 'slug' | 'name' | 'imageUrl'>;
