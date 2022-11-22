import { Request, Response } from 'express';
import _ from 'lodash';
import moment from 'moment';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import TransactionHistory, { ITransactionHistory, PaymentAction } from '../../Models/TransactionHistory';
import DateTimeUtil from './../../utils/DateTimeUtil';
import { OrderAction } from './OrderService';

export interface ChartType {
    params: ChartParam[];
    results: Record<string, any>[];
}

export type ChartParam = {
    code: string;
    name: string;
};

interface GetDataChartRequest {
    orderAction: OrderAction;
    paymentAction: PaymentAction;
    fromDate: Date;
    toDate: Date;
    params: ChartParam;
}

const getCoinPayChart = async (req: Request<any, any, any, GetDataChartRequest>, res: Response) => {
    const user = req.session.user;
    if (!user) return res.json(ResponseFail('Không tìm thấy User'));

    const { orderAction, paymentAction, fromDate, toDate } = req.query;
    const historyFieldName = orderAction === OrderAction.Buy ? 'userTransferId' : 'userReceiveId';

    const histories = (await TransactionHistory.find({ [historyFieldName]: user?.id, action: paymentAction })).map(
        x => _.get({ ...x }, '_doc') as ITransactionHistory,
    );

    // gro
    let momentFromDate = moment(fromDate);
    const momentToDate = moment(toDate);

    const params: ChartParam[] = [
        {
            code: 'TotalCoin',
            name: 'Coin đã nạp',
        },
    ];

    const result: ChartType = {
        params: params,
        results: [],
    };

    while (DateTimeUtil.diffTwoMomentDate(momentFromDate, momentToDate, 'd') <= 0) {
        const historiesWithSameDay = histories.filter(x => {
            return (
                DateTimeUtil.diffTwoMomentDate(
                    momentFromDate,
                    moment(moment(x.createdAt, DateTimeUtil.YmdFormat).format(DateTimeUtil.YmdFormat)),
                    'd',
                ) === 0
            );
        });

        const sum = historiesWithSameDay.reduce((total, history) => total + Number(history.totalVnd), 0);

        // do something
        result.results.push({
            timeKey: momentFromDate.format(DateTimeUtil.DmyFormat),
            TotalCoin: sum <= 0 ? null : sum,
        } as Record<string, any>);

        momentFromDate.add(1, 'd');
    }

    return res.json(ResponseOk(result));
};

const StatisticService = {
    getCoinPayChart,
};

export default StatisticService;
