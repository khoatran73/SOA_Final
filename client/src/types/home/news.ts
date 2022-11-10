import { Identifier } from '../shared';
import { AppUser } from '../ums/AuthUser';

export interface News {
    id: Identifier;
    categoryId: Identifier;
    title: string;
    price: number;
    description: string;
    imageUrls: string[];
    userId: Identifier;
    createdAt: Date;
    updatedAt: Date;
}

export type NewsRequest = News & Pick<AppUser, 'province' | 'district' | 'ward'>;

export type NewsResponse = News & Partial<AppUser>;

export type NewsResponseWithAddress = News & {
    address: string;
};

export type NewsSearch = Pick<News, 'id' | 'title'> & { categoryName: string };

