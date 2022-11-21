import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import CategoryService from '../../Services/product/CategoryService';

const router = express.Router();
// @ts-ignore
/**
 * @openapi
 * '/api/product/category/index':
 *  get:
 *     tags:
 *     - Category
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/index', CategoryService.getCategoryIndex);
/**
 * @openapi
 * '/api/product/category/create':
 *  post:
 *     tags:
 *     - Category
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Category'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', CategoryService.addCategory);
/**
 * @openapi
 * '/api/product/category/update/{id':
 *  post:
 *     tags:
 *     - Category
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Category'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', CategoryService.updateCategory);
/**
 * @openapi
 * '/api/product/category/delete/{id}':
 *  delete:
 *     tags:
 *     - Category
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
router.delete('/delete/:id', CategoryService.deleteCategory);
/**
 * @openapi
 * '/api/product/category/combo':
 *  get:
 *     tags:
 *     - Category
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/combo', CategoryService.comboCategory);
/**
 * @openapi
 * '/api/product/category/category-with-slug':
 *  get:
 *     tags:
 *     - Category
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/category-with-slug', CategoryService.getCategoriesWithSlug);
/**
 * @openapi
 * components:
 *  types:
 *    Category:
 *      type: object
 *      properties:
 *        code:
 *          type: string
 *          default: string
 *        name:
 *          type: string
 *          default: string
 *        slug:
 *          type: string
 *          default: string
 *        type:
 *          type: string
 *          default: string
 *        imageUrl:
 *          type: string
 *          default: string
*/
export default router;
