import clsx from 'clsx';
import { EChartsOption } from 'echarts';
import moment from 'moment';
import React from 'react';
import { ReactECharts } from '~/component/Echart/ReactECharts';
import { AppContainer } from '~/component/Layout/AppContainer';
import { ChartOption } from '~/types/chart/Chart';

interface Props {
    chartOption: ChartOption;
    title: string;
}

const NewsChart: React.FC<Props> = props => {
    const { title, chartOption } = props;
    const option: EChartsOption = {
        title: {
            text: title,
        },
        grid: {
            top: 50,
            left: 80,
            right: 30,
            height: '250px',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    title: 'Tải ảnh'
                },
            },
        },
        legend: {
            data: chartOption.dataLegend,
            bottom: '12%',
            padding: [20, 40],
            borderWidth: 1,
        },
        xAxis: {
            type: 'category',
            data: chartOption.dataDate,
            axisLabel: {
                interval: chartOption.interval ?? 1,
                rotate: 45,
                fontSize: 10,
            },
            boundaryGap: false,
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
            },
            min: chartOption.min,
            max: chartOption.max,
            splitNumber: 2,
        },
        dataZoom: [
            {
                show: true,
            },
        ],
        series: chartOption.series,
    };

    return (
        <AppContainer>
            <div className="w-auto h-full relative">
                <div className="h-auto">
                    {/* <div
                        className={clsx(
                            'flex justify-between px-2 text-white sticky top-0 z-10',
                            'h-[37px] bg-[#f5f7f7] shadow-[2px 2px 5px 0 #0000001f, 1px 3px 2px 0 #00000014]',
                            '',
                        )}
                    >
                        <div className="flex items-center text-[#0088fe]">
                            <div className="mr-2 font-bold text-lg">{title}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex mr-4">
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        'bg-[#0a4f8b]',
                                    )}
                                >
                                    7N
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                    )}
                                >
                                    1T
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        '',
                                    )}
                                >
                                    3T
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        '',
                                    )}
                                >
                                    6T
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        '',
                                    )}
                                >
                                    1 NĂM
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        '',
                                    )}
                                >
                                    YTD
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center mr-1 bg-[#018ccf] text-[10px] py-1.5 px-3',
                                        '',
                                    )}
                                >
                                    10 NĂM
                                </div>
                            </div>
                            <div className="mr-2 box-filter">
                                <i className="fa fa-arrow-down" />
                            </div>
                        </div>
                    </div>  */}
                    <ReactECharts option={option} style={{ height: '450px' }} />
                </div>
            </div>
        </AppContainer>
    );
};

// const NewsChart: React.FC<Props> = props => {
//     return <div className="bg-white">NewsChart</div>;
// };

export default NewsChart;
