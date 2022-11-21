import express from 'express';
import PaymentService from '../../Services/Common/PaymentService';
import PayPalService from '../../Services/Common/PaypalService';


const router = express.Router();

/**
 * @openapi
 * '/api/payment/paypal':
 *  post:
 *     tags:
 *     - Payment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/PaymentPayPal'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/paypal', PayPalService.PaymentPayPal);

/**
 * @openapi
 * '/api/payment/success':
 *  get:
 *     tags:
 *     - Payment
 *     parameters:
 *      - name: total
 *        in: query
 *        required: true
 *      - name: PayerID
 *        in: query
 *        required: true
 *      - name: currency
 *        in: query
 *        required: true
 *      - name: userId
 *        in: query
 *        required: true
 *      - name: url
 *        in: query
 *        required: true
 *      - name: action
 *        in: query
 *        required: true
 *      - name: note
 *        in: query
 *      - name: name
 *        in: query
 *      - name: phone
 *        in: query
 *      - name: province
 *        in: query
 *      - name: district
 *        in: query
 *      - name: ward
 *        in: query
 *      - name: address
 *        in: query
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/success', PayPalService.PaymentPayPalSuccess);
/**
 * @openapi
 * '/api/payment/by-coin':
 *  post:
 *     tags:
 *     - Payment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/PaymentCoin'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/by-coin', PaymentService.payment);
// router.get('/cancel', PayPalService.cancel);
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
 *    PaymentPayPal:
 *      type: object
 *      properties:
 *        total:
 *          type: string
 *          default: string
 *        currency:
 *          type: string
 *          default: string
 *        coin:
 *          type: string
 *          default: string
 *        newsId:
 *          type: string
 *          default: string  
 *        userId:
 *          type: string
 *          default: string  
 *        url:
 *          type: string
 *          default: string  
 *        action:
 *          type: string
 *          default: string  
 *        note:
 *          type: string
 *          default: string  
 *        phone:
 *          type: string
 *          default: string  
 *        province:
 *          type: string
 *          default: string  
 *        district:
 *          type: string
 *          default: string  
 *        ward:
 *          type: string
 *          default: string  
 *        address:
 *          type: string
 *          default: string  
 *        items:
 *          type: array
 *          items:  
 *              $ref: '#/components/types/ItemPayment'
 *    PaymentCoin:
 *      type: object
 *      properties:
 *        newsId:
 *          type: string
 *          default: string
 *        userPaymentId:
 *          type: string
 *          default: string
 *        address:
 *          type: string
 *          default: string
 *        note:
 *          type: string
 *          default: string
*/

export default router;
