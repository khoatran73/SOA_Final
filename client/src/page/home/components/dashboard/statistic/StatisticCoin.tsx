import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { STATISTIC_COIN_API } from '~/page/home/api/api';
import { ChartType, Series } from '~/types/chart/Chart';
import { PaymentAction } from '~/types/home/history';
import { OrderAction } from '~/types/home/order';
import DateTimeUtil from '~/util/DateTimeUtil';
import BaseChart from '../../chart/BaseChart';

interface GetDataChartRequest {
    orderAction: OrderAction;
    paymentAction: PaymentAction;
    fromDate: string;
    toDate: string;
}

const getCharts = (params: GetDataChartRequest) => {
    return requestApi<ChartType>('get', STATISTIC_COIN_API, {}, { params: params });
};

const StatisticCoin: React.FC = () => {
    const [state, setState] = useMergeState<{
        fromDate: string;
        toDate: string;
        activeButton: number;
    }>({
        fromDate: moment().subtract(2, 'd').format(DateTimeUtil.YmdFormat),
        toDate: moment().format(DateTimeUtil.YmdFormat),
        activeButton: 0,
    });

    const { data: request, isLoading } = useQuery(['GetDataChart', state.fromDate, state.toDate], () =>
        getCharts({
            orderAction: OrderAction.Buy,
            paymentAction: PaymentAction.Coin,
            fromDate: state.fromDate,
            toDate: state.toDate,
        }),
    );

    const chartData = request?.data?.result || ({} as ChartType);

    const renderChart = (data: ChartType, title: string) => {
        const dataLegend: Array<string> = [];
        const dataDate: Array<string> = [];
        const series: Array<Series> = [];
        let isAddedDate = false;
        let min = Number.MAX_VALUE;
        let max = 0;

        if (data !== null) {
            data?.params?.forEach(param => {
                dataLegend.push(param.name);
                const dataChart: any[] = [];
                data?.results?.forEach(result => {
                    if (!isAddedDate) {
                        dataDate.push(result.timeKey);
                    }
                    const value = _.get(result, [param.code]);
                    dataChart.push(value);

                    if (value != null && value < min) min = value;
                    if (value != null && value > max) max = value;
                });

                isAddedDate = true;

                series.push({
                    name: param.name,
                    data: dataChart,
                    type: 'line',
                    showSymbol: false,
                    smooth: true,
                    connectNulls: true,
                    areaStyle: {},
                } as Series);
            });
        }

        return (
            <BaseChart
                chartOption={{
                    dataLegend: dataLegend,
                    dataDate: dataDate,
                    series: series,
                    min: 0,
                    max: max + max / 100,
                    interval: Math.floor(dataDate.length / 30),
                }}
                title={title}
                setState={setState}
                activeButton={state.activeButton}
                isLoading={isLoading}
            />
        );
    };

    return (
        <div className="h-full overflow-y-auto">
            {renderChart(chartData, 'Coin đã nạp')}
        </div>
    );
};

export default StatisticCoin;
