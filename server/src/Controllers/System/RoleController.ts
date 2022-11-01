import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import RoleService from '../../Services/System/RoleService';

const router = express.Router();
router.get('/index', RoleService.getRoleIndex);
router.post('/create', RoleService.addRole);
router.put('/update/:id', RoleService.updateRole);
router.delete('/delete/:id', RoleService.deleteRole);
router.get('/combo', RoleService.getComboRole);
router.put('/update-user-role', RoleService.updateUserRole);

export default router;
