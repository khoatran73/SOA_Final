export interface AuthUser {
    rights: string[];
    user: AppUser;
}

/**
 * @openapi
 * components:
 *  types:
 *    AppUser:
 *      type: object
 *      properties:
 *        fullName:
 *          type: string
 *          default: string
 *        phoneNumber:
 *          type: string
 *          default: string
 *        province:
 *          type: string
 *          default: string
 *        district:
 *          type: string
 *          default: string
 *        ward:
 *          type: string
 *          default: string
 *        address:
 *          type: string
 *          default: string
 *        avatar:
 *          type: string
 *          default: string
 *        deliveryAddress:
 *          type: array
 *          items: 
 *            $ref: '#/components/types/DeliveryAddress'
 *    LoginParams:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          default: string
 *        password:
 *          type: string
 *          default: string
 *    DeliveryAddress:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: string
 *        phone:
 *          type: string
 *          default: string
 *        province:
 *          type: string
 *          default: string
 *        district:
 *          type: string
 *          default: string
 *        ward:
 *          type: string
 *          default: string
 *        address:
 *          type: string
 *          default: string
 *        isDefault:
 *          type: boolean
 *          default: true
 *    AddUserParams:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          default: string
 *        password:
 *          type: string
 *          default: string
 *        fullName:
 *          type: string
 *          default: string
 *        phoneNumber:
 *          type: string
 *          default: string
 *        emailAddress:
 *          type: string
 *          default: string
 *    OtpParams:
 *      type: object
 *      properties:
 *        username:
 *         type: string
 *         default: string
 *        emailAddress:
 *         type: string
 *         default: string
 */


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
    //
    deliveryAddress?: DeliveryAddress[];
};

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
