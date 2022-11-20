import express from 'express';
import PaymentService from '../../Services/Common/PaymentService';
import PayPalService from '../../Services/Common/PaypalService';


const router = express.Router();


router.post('/paypal', PayPalService.PaymentPayPal);
router.get('/success', PayPalService.PaymentPayPalSuccess);
router.post('/by-coin', PaymentService.payment);
// router.get('/cancel', PayPalService.cancel);


export default router;
