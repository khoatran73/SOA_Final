export enum SellType {
    SellOnline = 'SellOnline',
    SellOffline = 'SellOffline',
}

export interface ICategory {
    id: string;
    code: string;
    name: string;
    slug: string;
    type: SellType;
    imageUrl?: string;
}

export type CategoryWithSlug = Pick<ICategory, 'id' | 'slug' | 'name' | 'imageUrl'>;
