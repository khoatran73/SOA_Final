import { Identifier } from 'shared';

export type NewsBump = {
    fromDate: string;
    toDate: string;
    day: number; // lần mua gần nhất
};

export enum NewsStatus {
    OnSell = 'OnSell', // dang ban
    Sold = 'Sold', // da ban -> ẩn
}

export interface INews {
    id?: Identifier;
    categoryId?: Identifier;
    title?: string;
    price?: number;
    description?: string;
    imageUrls?: string[];
    userId?: Identifier;
    status?: NewsStatus;
    bumpImage?: NewsBump;
    bumpPriority?: NewsBump;
    province: string;
    district: string;
    ward: string;
    address: string; //d/c cụ thể
    productTypeId: string;
}
