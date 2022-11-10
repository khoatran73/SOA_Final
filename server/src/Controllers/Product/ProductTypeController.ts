import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import ProductTypeService from '../../Services/product/ProductTypeService';

const router = express.Router();
// @ts-ignore
router.get('/index', ProductTypeService.getProductTypeIndex);
router.post('/create', ProductTypeService.addProductType);
router.put('/update/:id', ProductTypeService.updateProductType);
router.delete('/delete/:id', ProductTypeService.deleteProductType);
router.get('/combo', ProductTypeService.comboProductType);
router.get('/type-with-slug', ProductTypeService.getTypesWithSlug);

export default router;
