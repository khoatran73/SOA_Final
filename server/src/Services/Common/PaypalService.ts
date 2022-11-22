import paypal from 'paypal-rest-sdk';
import { Request, Response } from 'express';
import { ResponseOk } from '../../common/ApiResponse';
import User from '../../Models/User';
import TransactionHistory, { PaymentMethod } from '../../Models/TransactionHistory';
import News from '../../Models/News';
import { INews } from 'Home/News';
import { queryStringSerialize } from '../../helpers/QuerySeriable';
import Order, { OrderStatus } from '../../Models/Order';
import _ from 'lodash';
import PlacementService from './PlacementService';
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
    const { coin, newsId, url, address, action, note } = req.body;
    const amount = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    const queryParams = queryStringSerialize({
        total: amount,
        currency: items[0]?.currency,
        coin: coin === 'undefined' ? '' : coin,
        newsId: newsId === 'undefined' ? '' : newsId,
        userId: user?.id,
        url: url,
        // address: address,
        action: action,
        note: note,
        name: _.get(address, 'name'),
        phone: _.get(address, 'phone'),
        province: _.get(address, 'province'),
        district: _.get(address, 'district'),
        ward: _.get(address, 'ward'),
        address: _.get(address, 'address'),
    });
    const createPaymentJson = {
        intent: 'sale',
        payer: {
            payment_method: PaymentMethod.PayPal,
        },
        redirect_urls: {
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
    paypal.payment.create(createPaymentJson, function (error, payment) {
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
    const { total, currency, userId, url, action, note, name, phone, province, district, ward, address } = req.query;
    const coin = req.query.coin;
    const newsId = req.query.newsId;

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
    if (newsId) {
        newDetails = (await News.findOne({ id: newsId })) ?? {};
    }
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            if (coin) {
                await User.findOneAndUpdate({ id: userId }, { $inc: { amount: coin } });
            }
            const provinceName = PlacementService.getProvinceByCode(province?.toString())?.name;
            const districtName = PlacementService.getDistrictByCode(province?.toString(), district?.toString())?.name;
            const wardName = PlacementService.getWardByCode(district?.toString(), ward?.toString())?.name;

            const history = new TransactionHistory({
                userTransferId: userId,
                paymentMethod: PaymentMethod.PayPal,
                action: action,
                currency: payment.transactions[0].amount.currency,
                total: payment.transactions[0].amount.total,
                title: payment.transactions[0]?.item_list?.items[0].name ?? '',
                totalVnd: Number(newDetails.price ?? coin),
                newsId: newsId,
                userReceiveId: newDetails?.userId,
                description: newDetails?.description,
                address: {
                    name,
                    phone,
                    district,
                    province,
                    ward,
                    address,
                    provinceName: provinceName ?? '',
                    districtName: districtName ?? '',
                    wardName: wardName ?? '',
                },
                note: note,
            });
            history.setId(Math.random());
            const order = new Order({
                historyId: history.id,
                status: OrderStatus.Waiting,
                updatedBy: userId,
            });
            await history.save();
            order.setId(Math.random());
            await order.save();
        }
    });
    
    if (url?.toString()?.[0] === '/') return res.redirect(`http://localhost:3000${url}`);
    return res.redirect(`http://localhost:3000/${url}`);
};

const PayPalService = {
    PaymentPayPal,
    PaymentPayPalSuccess,
};
export default PayPalService;
