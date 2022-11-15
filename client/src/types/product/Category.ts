import { ComboOption } from '~/types/shared';

export enum SellType {
    SellOnline = 'SellOnline',
    SellOffline = 'SellOffline',
}

export const SellTypeOptions: ComboOption[] = [
    {
        value: SellType.SellOnline,
        label: 'Bán Online',
    },
    {
        value: SellType.SellOffline,
        label: 'Bán Offline',
    },
];

export interface Category {
    id: string;
    code: string;
    name: string;
    slug: string;
    type: SellType;
    imageUrl?: string;
}

export type CategoryWithSlug = Pick<Category, 'id' | 'slug' | 'name' | 'imageUrl'>;
