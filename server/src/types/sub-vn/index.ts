declare module 'sub-vn' {
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

    export function getProvinces(): Array<Province>;
    export function getDistricts(): Array<District>;
    export function getWards(): Array<Ward>;
    export function getProvincesWithDetail(): ProvinceTree;
    export function getDistrictsByProvinceCode(provinceCode: string): Array<District>;
    export function getWardsByDistrictCode(districtCode: string): Array<Ward>;
    export function getWardsByProvinceCode(provinceCode: string): Array<Ward>;
}
