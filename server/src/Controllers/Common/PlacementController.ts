import express from 'express';
import PlacementService from '../../Services/Common/PlacementService';

const router = express.Router();

router.get('/tree-province', PlacementService.getTreeProvince);
router.get('/provinces', PlacementService.getAllProvinces);
router.get('/province', PlacementService.getProvince);
router.get('/districts', PlacementService.getDistricts);
router.get('/wards', PlacementService.getWards);


export default router;
