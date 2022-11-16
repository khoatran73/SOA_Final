import { Identifier } from '../shared';
import { AppUser } from '../ums/AuthUser';

export type NewsBump = {
    fromDate?: Date;
    toDate?: Date;
    day: number;
};

export enum NewsStatus {
    OnSell = 'OnSell', // dang ban
    Sold = 'Sold', // da ban -> ẩn
}

export interface News {
    id: Identifier;
    categoryId: Identifier;
    title: string;
    price: number;
    description: string;
    imageUrls: string[];
    userId: Identifier;
    status?: NewsStatus;
    bumpImage?: NewsBump;
    bumpPriority?: NewsBump;
    createdAt: Date;
    updatedAt: Date;
}

export type NewsRequest = News & Pick<AppUser, 'province' | 'district' | 'ward'>;

export type NewsResponse = News &
    Partial<AppUser> & {
        slug: string;
        page?: number;
    };

export type NewsResponseWithAddress = News & {
    address: string;
};

export type NewsSearch = NewsResponse & { categoryName: string };
