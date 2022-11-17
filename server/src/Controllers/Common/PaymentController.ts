import express from 'express';
import PayPalService from '../../Services/Common/PaypalService';


const router = express.Router();


router.post('/', PayPalService.PaymentPayPal);
router.get('/success', PayPalService.PaymentPayPalSuccess);
// router.get('/cancel', PayPalService.cancel);


export default router;
