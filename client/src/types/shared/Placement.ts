export type Province = {
    code: string;
    name: string;
    unit: string;
};

export type District = Province & {
    province_code: 54;
    province_name: string;
    full_name: string;
};

export type Ward = District & {
    district_code: string;
    district_name: string;
}

export type ProvinceTree = Record<string, Province & {
    districts: Record<string, District & {
        wards: Record<string, Ward>
    }>
}>;