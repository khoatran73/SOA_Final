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
/**
 * @openapi
 * '/api/identity/get-user:
 *  get:
 *     tags:
 *     - Identity
 *     parameters:
 *      - name: id
 *        in: query
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
router.get('/get-user', Authenticate, IdentityService.getUser);
/**
 * @openapi
 * '/api/identity/get-list-user':
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
router.get('/get-list-user', IdentityService.getListUsers);
/**
 * @openapi
 * '/api/identity/logout':
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
/**
 * @openapi
 * '/api/identity/get-otp':
 *  post:
 *     tags:
 *     - Identity
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/OtpParams'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/get-otp', IdentityService.getOTP);
/**
 * @openapi
 * '/api/identity/add-user':
 *  post:
 *     tags:
 *     - Identity
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/AddUserParams'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
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
/**
 * @openapi
 * '/api/identity/update-delivery/{id}':
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
 *              $ref: '#/components/types/DeliveryAddress'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
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
