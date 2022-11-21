import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import MenuService from '../../Services/System/MenuService';

const router = express.Router();
/**
 * @openapi
 * '/api/menu/layout':
 *  get:
 *     tags:
 *     - Menu
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/layout', MenuService.getMenuLayout);
// @ts-ignore
/**
 * @openapi
 * '/api/menu/index':
 *  get:
 *     tags:
 *     - Menu
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/index', MenuService.getMenuIndex);
/**
 * @openapi
 * '/api/menu/create':
 *  post:
 *     tags:
 *     - Menu
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Menu'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', MenuService.addMenu);
/**
 * @openapi
 * '/api/menu/update/{id}':
 *  put:
 *     tags:
 *     - Menu
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Menu'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', MenuService.updateMenu);
/**
 * @openapi
 * '/api/menu/delete/{id}':
 *  delete:
 *     tags:
 *     - Menu
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
router.delete('/delete/:id', MenuService.deleteMenu);
/**
 * @openapi
 * components:
 *  types:
 *    Menu:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: string
 *        route:
 *          type: string
 *          default: string
 *        icon:
 *          type: string
 *          default: string
 *        parentId:
 *          type: boolean
 *          default: true
 *        background:
 *          type: string
 *          default: string
 *        path:
 *          type: string
 *          default: string
 *        level:
 *          type: number
 *        permissions:
 *          type: string
 *          default: string
 *        isDisplay:
 *          type: boolean
 *          default: true
 *        displayIndex:
 *          type: number
 *          default: null
 *        group:
 *          type: array
 *          default: []
 *        index:
 *          type: number
*/
export default router;
