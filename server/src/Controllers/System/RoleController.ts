import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import RoleService from '../../Services/System/RoleService';

const router = express.Router();
/**
 * @openapi
 * '/api/role/index':
 *  get:
 *     tags:
 *     - Role
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/index', RoleService.getRoleIndex);
/**
 * @openapi
 * '/api/role/create':
 *  post:
 *     tags:
 *     - Role
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Role'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', RoleService.addRole);
/**
 * @openapi
 * '/api/role/update/{id}':
 *  put:
 *     tags:
 *     - Role
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Role'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', RoleService.updateRole);
/**
 * @openapi
 * '/api/role/delete':
 *  delete:
 *     tags:
 *     - Role
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.delete('/delete/:id', RoleService.deleteRole);
/**
 * @openapi
 * '/api/role/combo':
 *  get:
 *     tags:
 *     - Role
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/combo', RoleService.getComboRole);
/**
 * @openapi
 * '/api/role/update-user-role':
 *  put:
 *     tags:
 *     - Role
 *     parameters:
 *      - name: roleId
 *        in: path
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Role'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update-user-role', RoleService.updateUserRole);
/**
 * @openapi
 * components:
 *  types:
 *    Role:
 *      type: object
 *      properties:
 *        code:
 *          type: string
 *          default: string
 *        name:
 *          type: string
 *          default: string
*/
export default router;
