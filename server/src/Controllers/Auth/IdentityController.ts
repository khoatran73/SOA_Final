import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import IdentityService from '../../Services/Auth/IdentityService';

const router = express.Router();
/**
 * @openapi
 * '/api/identity/check-login':
 *  get:
 *     tags:
 *     - Identity
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/check-login', IdentityService.checkLogin);
router.get('/get-user', Authenticate, IdentityService.getUser);
router.get('/get-list-user', IdentityService.getListUsers);
router.get('/logout', Authenticate, IdentityService.logout);

/**
 * @openapi
 * '/api/identity/login':
 *  post:
 *     tags:
 *     - Identity
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/LoginParams'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/login', IdentityService.login);
router.post('/get-otp', IdentityService.getOTP);
router.post('/add-user', Authenticate, IdentityService.addUser);
router.post('/register-user', IdentityService.registerUser);
/**
 * @openapi
 * '/api/identity/update/{id}':
 *  put:
 *     tags:
 *     - Identity
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of user
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/AppUser'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', Authenticate, IdentityService.updateUser);
router.put('/update-delivery/:id', Authenticate, IdentityService.updateDeliveryAddress);

/**
 * @openapi
 * '/api/identity/delete/{id}':
 *  delete:
 *     tags:
 *     - Identity
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of user
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.delete('/delete/:id', Authenticate, IdentityService.deleteUser);

export default router;
