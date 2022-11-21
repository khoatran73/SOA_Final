import express from 'express';
import PlacementService from '../../Services/Common/PlacementService';

const router = express.Router();
/**
 * @openapi
 * '/api/placement/tree-province':
 *  get:
 *     tags:
 *     - Placement
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/tree-province', PlacementService.getTreeProvince);
/**
 * @openapi
 * '/api/placement/provinces':
 *  get:
 *     tags:
 *     - Placement
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/provinces', PlacementService.getAllProvinces);
/**
 * @openapi
 * '/api/placement/province':
 *  get:
 *     tags:
 *     - Placement
 *     parameters:
 *      - name: code
 *        in: query
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/province', PlacementService.getProvince);
/**
 * @openapi
 * '/api/placement/districts':
 *  get:
 *     tags:
 *     - Placement
 *     parameters:
 *      - name: provinceCode
 *        in: query
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/districts', PlacementService.getDistricts);
/**
 * @openapi
 * '/api/placement/wards':
 *  get:
 *     tags:
 *     - Placement
 *     parameters:
 *      - name: districtCode
 *        in: query
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/wards', PlacementService.getWards);

/**
 * @openapi
 * components:
 *  types:
 *    ItemPayment:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: string
 *        sku:
 *          type: string
 *          default: string
 *        currency:
 *          type: string
 *          default: string
 *        quantity:
 *          type: string
 *          default: string
*/
export default router;
