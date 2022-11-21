import express from 'express';
import Authenticate from '../../MiddleWares/Authenticate';
import ProductTypeService from '../../Services/product/ProductTypeService';

const router = express.Router();
// @ts-ignore
/**
 * @openapi
 * '/api/product/type/index':
 *  get:
 *     tags:
 *     - ProductType
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/index', ProductTypeService.getProductTypeIndex);
/**
 * @openapi
 * '/api/product/type/create':
 *  post:
 *     tags:
 *     - ProductType
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/ProductType'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', ProductTypeService.addProductType);
/**
 * @openapi
 * '/api/product/type/update/{id':
 *  put:
 *     tags:
 *     - ProductType
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/ProductType'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', ProductTypeService.updateProductType);
/**
 * @openapi
 * '/api/product/type/delete/{id}':
 *  delete:
 *     tags:
 *     - ProductType
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
router.delete('/delete/:id', ProductTypeService.deleteProductType);

/**
 * @openapi
 * '/api/product/type/combo':
 *  get:
 *     tags:
 *     - ProductType
 *     parameters:
 *      - name: categoryId
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
router.get('/combo', ProductTypeService.comboProductType);
/**
 * @openapi
 * '/api/product/type/type-with-slug':
 *  get:
 *     tags:
 *     - ProductType
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/type-with-slug', ProductTypeService.getTypesWithSlug);
/**
 * @openapi
 * components:
 *  types:
 *    ProductType:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: string
 *        slug:
 *          type: string
 *          default: string
 *        categoryId:
 *          type: string
 *          default: string
 *        imageUrl:
 *          type: string
 *          default: string
*/
export default router;
