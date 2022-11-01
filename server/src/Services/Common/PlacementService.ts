import { Request, Response } from 'express';
import type { District, Province, ProvinceTree, Ward } from 'sub-vn';
import { getDistrictsByProvinceCode, getProvinces, getProvincesWithDetail, getWardsByDistrictCode } from 'sub-vn';
import { ResponseOk } from '../../common/ApiResponse';

const getAllProvinces = (req: Request, res: Response) => {
    return res.json(ResponseOk<Province[]>(getProvinces()));
};

const getProvince = (req: Request<any, any, any, { code: string }>, res: Response) => {
    const provinces = getProvinces();
    const province = provinces.find(x => x.code === req.query.code);
    return res.json(ResponseOk<Province>(province));
};

const getDistricts = (req: Request<any, any, any, { provinceCode: string }>, res: Response) => {
    return res.json(ResponseOk<District[]>(getDistrictsByProvinceCode(req.query.provinceCode)));
};

const getWards = (req: Request<any, any, any, { districtCode: string }>, res: Response) => {
    return res.json(ResponseOk<Ward[]>(getWardsByDistrictCode(req.query.districtCode)));
};

const getTreeProvince = (req: Request, res: Response) => {
    return res.json(ResponseOk<ProvinceTree>(getProvincesWithDetail()));
};

const PlacementService = {
    getAllProvinces,
    getProvince,
    getDistricts,
    getWards,
    getTreeProvince
};

export default PlacementService;
