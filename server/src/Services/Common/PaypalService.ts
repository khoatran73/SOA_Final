import paypal from 'paypal-rest-sdk';
import { Request, Response } from 'express';
import { ResponseOk } from '../../common/ApiResponse';
import User from '../../Models/User';
import TransactionHistory from '../../Models/TransactionHistory';
import News from '../../Models/News';
import { INews } from 'Home/News';
import { queryStringSerialize } from '../../helpers/QuerySeriable';
paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: 'AYQJggj5ZcwxUGY91V-K7RDDeDN2SVJvLF-YNaxJB_gXgn9wx2HUI6AoYsMCkl2qoDVEaPOm2YQ-_XWl',
    client_secret: 'EFCeFpBYncBt9QUV2AcsjMIVft8iashdTTc1JwcSxIMAKRRXey8Xg0mF6Mjzs8jzBVbhOxDr8qIg-dyf',
});

type ItemPayment = {
    name: string;
    sku: string;
    price: string;
    currency: string;
    quantity: number;
};

export const PaymentPayPal = async (req: Request, res: Response) => {
    const items: ItemPayment[] = req.body.items;
    const user = req.session.user;
    const { coin, newId, url, address } = req.body;
    const amount = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    const queryParams = queryStringSerialize({
        total: amount,
        currency: items[0]?.currency,
        coin: coin === 'undefined' ? '' : coin,
        newId: newId === 'undefined' ? '' : newId,
        userId: user?.id,
        url: url,
        address: address,
    });
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            // return_url: `http://localhost:3000/api/payment/success?total=${amount}&currency=${items[0]?.currency}&coin=${coin}&userId=${user?.id}&newId=${newId}`,
            return_url: `http://localhost:3000/api/payment/success?${queryParams}`,
            cancel_url: 'http://localhost:3000/api/payment/cancel',
        },
        transactions: [
            {
                item_list: {
                    items: items,
                },
                amount: {
                    currency: 'USD',
                    total: amount.toString(),
                },
                description: 'This is the payment description.',
            },
        ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            payment.links?.forEach(link => {
                if (link.rel === 'approval_url') {
                    console.log('link', link);
                    res.json(ResponseOk(link.href));
                }
            });
        }
    });
};

export const PaymentPayPalSuccess = async (req: Request, res: Response) => {
    const payerId = req.query.PayerID as string;
    const { total, currency, userId, url, address } = req.query;
    const coin = req.query.coin;
    const newId = req.query.newId;

    let newDetails: any = {};
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount: {
                    currency: currency as string,
                    total: Number(total).toString(),
                },
            },
        ],
    };
    const paymentId = req.query.paymentId as string;
    if (newId) {
        newDetails = (await News.findOneAndUpdate({ id: newId }, { status: 'Sold' })) ?? {};
    }
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            if (coin) {
                await User.findOneAndUpdate({ id: userId }, { $inc: { amount: coin } });
            }
            const history = {
                userTransferId: userId,
                method: payment.payer.payment_method,
                currency: payment.transactions[0].amount.currency,
                total: payment.transactions[0].amount.total,
                title: payment.transactions[0]?.item_list?.items[0].name,
                totalVND: Number(newDetails.price ?? coin),
                newId: newId,
                userReceiveId: newDetails?.userId,
                description: newDetails?.description,
                address: address,
            };
            await TransactionHistory.create(history);
        }
    });
    res.redirect(`http://localhost:3000/${url}`);
};

const PayPalService = {
    PaymentPayPal,
    PaymentPayPalSuccess,
};
export default PayPalService;
