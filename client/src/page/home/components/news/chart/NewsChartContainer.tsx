import _ from 'lodash';
import React from 'react';
import { FoChartType, Series } from '~/types/chart/Chart';
import NewsChart from './NewsChart';

const NewsChartContainer: React.FC = () => {
    const renderChart = (data: FoChartType, title: string) => {
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
                    lineStyle: {
                        type: param.lineType || 'solid',
                    },
                } as Series);
            });
        }

        return (
            <NewsChart
                chartOption={{
                    dataLegend: dataLegend,
                    dataDate: dataDate,
                    series: series,
                    min: min,
                    max: max + 200000,
                    interval: Math.floor(dataDate.length / 30),
                }}
                title={title}
            />
        );
    };
    // if (state.loading) return <Loading />;
    return (
        <div className="h-full overflow-y-auto">
            {renderChart(
                {
                    params: [
                        {
                            code: 'TotalRevenue',
                            name: 'Tổng thu',
                            unit: 'VND',
                        },
                        {
                            code: 'TotalPay',
                            name: 'Tổng chi',
                            unit: 'VND',
                        },
                    ],
                    results: [
                        {
                            'TotalRevenue': 9754999,
                            timeKey: '25/04/2022',
                            'TotalPay': 8962999,
                        },
                        {
                            'TotalRevenue': 10223999,
                            timeKey: '26/04/2022',
                            'TotalPay': 9091999,
                        },
                        {
                            'TotalRevenue': 10290999,
                            timeKey: '27/04/2022',
                            'TotalPay': 9525999,
                        },
                        {
                            'TotalRevenue': 10573999,
                            timeKey: '28/04/2022',
                            'TotalPay': 9360999,
                        },
                        {
                            'TotalRevenue': 10816999,
                            timeKey: '29/04/2022',
                            'TotalPay': 9440999,
                        },
                    ],
                },
                'Thống kê thu chi',
            )}
            {/* {renderChart(state.dataCp, 'GIÁ CP')}
            {renderChart(state.dataUsd, 'US DOLLAR / VNĐ')} */}
        </div>
    );
};

export default NewsChartContainer;
