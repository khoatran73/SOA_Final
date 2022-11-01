import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import MenuService from '../../Services/System/MenuService';

const router = express.Router();
router.get('/layout', MenuService.getMenuLayout);
// @ts-ignore
router.get('/index', MenuService.getMenuIndex);
router.post('/create', MenuService.addMenu);
router.put('/update/:id', MenuService.updateMenu);
router.delete('/delete/:id', MenuService.deleteMenu);

export default router;
