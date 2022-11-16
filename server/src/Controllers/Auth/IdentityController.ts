import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import IdentityService from '../../Services/Auth/IdentityService';

const router = express.Router();

router.get('/check-login', IdentityService.checkLogin);
router.get('/get-user', IdentityService.getUser);
router.post('/login', IdentityService.login);
router.post('/add-user', Authenticate, IdentityService.addUser);
router.get('/logout', Authenticate, IdentityService.logout);

export default router;
