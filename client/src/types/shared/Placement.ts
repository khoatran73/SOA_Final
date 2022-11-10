export enum Placement {
    Province = 'Province',
    District = 'District',
    Ward = 'Ward',
}

// export type Placement = 'Province' | 'District' | 'Ward'

export type BasePlacement = {
    code: string;
    name: string;
    unit: string;
};

export type Province = BasePlacement;

export type District = Province & {
    province_code: 54;
    province_name: string;
    full_name: string;
};

export type Ward = District & {
    district_code: string;
    district_name: string;
};

export type ProvinceTree = Record<
    string,
    Province & {
        districts: Record<
            string,
            District & {
                wards: Record<string, Ward>;
            }
        >;
    }
>;
