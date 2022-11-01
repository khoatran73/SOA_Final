import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import CategoryService from '../../Services/product/CategoryService';

const router = express.Router();
// @ts-ignore
router.get('/index', CategoryService.getCategoryIndex);
router.post('/create', CategoryService.addCategory);
router.put('/update/:id', CategoryService.updateCategory);
router.delete('/delete/:id', CategoryService.deleteCategory);
router.get('/combo', CategoryService.comboCategory);

export default router;
