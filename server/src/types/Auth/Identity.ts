export interface AuthUser {
    rights: string[];
    user: AppUser;
}

export type AppUser = {
    id: string;
    username: string;
    fullName: string;
    isSupper: boolean;
    email: string;
    phoneNumber?: string;
    amount?: number;
    //
    province?: string;
    provinceName?: string;
    district?: string;
    districtName?: string;
    ward?: string;
    wardName?: string;
    address?: string;
    avatar: string;
    createdAt: string;
};

export interface LoginParams {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface NewUser {
    username: string;
    password: string;
    fullName: string;
}
