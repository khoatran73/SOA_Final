import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import IdentityService from '../../Services/Auth/IdentityService';

const router = express.Router();

router.get('/check-login', IdentityService.checkLogin);
router.get('/get-user', Authenticate, IdentityService.getUser);
router.get('/get-list-user', IdentityService.getListUsers);
router.post('/login', IdentityService.login);
router.post('/get-otp', IdentityService.getOTP);
router.post('/add-user', Authenticate, IdentityService.addUser);
router.post('/register-user', IdentityService.registerUser);
router.get('/logout', Authenticate, IdentityService.logout);

router.put('/update/:id', Authenticate, IdentityService.updateUser);
router.delete('/delete/:id', Authenticate, IdentityService.deleteUser);

router.put('/update-delivery/:id', Authenticate, IdentityService.updateDeliveryAddress);

export default router;
