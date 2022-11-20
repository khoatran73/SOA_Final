import { Identifier } from '../shared';

export interface AuthUser {
    rights: string[];
    user: AppUser;
    token: string;
}

export interface AppUser {
    id: string;
    username: string;
    fullName?: string;
    isSupper: boolean;
    email: string;
    phoneNumber?: string;
    orgId?: string;
    userCode?: string;
    amount?: number;
    //
    province?: string;
    provinceName?: string;
    district?: string;
    districtName?: string;
    ward?: string;
    wardName?: string;
    avatar: string;
    address: string;
    deliveryAddress?: DeliveryAddress[];
}

export interface DeliveryAddress {
    id: string; // id DeliveryAddress
    name: string; // tên người nhận
    phone: string; //sdt người nhận
    province: string; // code tỉnh
    provinceName: string;
    district: string; //code huyện
    districtName: string;
    wardName: string;
    ward: string; // code xã
    address: string; //đc cụ thể
    isDefault: boolean; // địa chỉ mặc định ?
}

export type User = Partial<AppUser> & {
    id: Identifier;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
    amount: number;
    createdAt: Date;
    province?: string;
    provinceName?: string;
    district?: string;
    districtName?: string;
    ward?: string;
    wardName?: string;
    address: string;
};

export interface LoginParam {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterParam {
    username: string;
    password: string;
    passwordCF: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    amount: number;
    province: string;
    district: string;
    ward: string;
}
