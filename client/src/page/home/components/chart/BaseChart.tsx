import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import DomToImage from 'dom-to-image';
import { EChartsOption } from 'echarts';
import React, { useRef } from 'react';
import { ReactECharts } from '~/component/Echart/ReactECharts';
import Loading from '~/component/Elements/loading/Loading';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { AppContainer } from '~/component/Layout/AppContainer';
import { ChartOption } from '~/types/chart/Chart';
import { listButtonFilter, listExtraButtonFilter } from './ListButtonFilter';

interface Props {
    chartOption: ChartOption;
    title: string;
    subTitle?: string;
    setState: (
        values: Partial<{
            fromDate: string;
            toDate: string;
            activeButton: number;
        }>,
    ) => void;
    activeButton: number;
    isLoading: boolean;
}

const getButtonFilter = () => {
    return listExtraButtonFilter.concat(listButtonFilter);
};

const BaseChart: React.FC<Props> = props => {
    const { title, chartOption } = props;
    const listButton = getButtonFilter();
    const containerRef = useRef<HTMLDivElement>(null);

    const exportDom = (filename: string) => {
        containerRef.current &&
            DomToImage.toJpeg(containerRef.current, { quality: 1, bgcolor: 'white' })
                .then(dataUrl => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = filename + '.png';
                    link.click();
                    URL.revokeObjectURL(dataUrl);
                })
                .catch(error => {
                    console.error('oops, something went wrong!', error);
                });
    };

    const option: EChartsOption = {
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
        legend: {
            data: chartOption.dataLegend,
            bottom: '12%',
            padding: [12, 16],
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
            splitNumber: 0,
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
            <div className="w-auto h-full relative" ref={containerRef}>
                <div className="h-auto">
                    <div
                        className={clsx(
                            'flex justify-between px-2 text-[#0088fe] sticky top-0 z-10',
                            'h-[37px] bg-[#f5f7f7] shadow ',
                        )}
                    >
                        <div className="flex items-center text-header">
                            <div className="mr-2 font-bold text-lg">{title}</div>
                            <div className="text-xs">{props.subTitle}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex mr-4">
                                {listButton.map((button, index) => (
                                    <Tooltip title={button.tooltip} key={button.name}>
                                        <div
                                            className={clsx(
                                                'mr-1 border border-[#018ccf] text-[10px] py-1.5 px-3 cursor-pointer bg-[#018ccf]',
                                                'text-white hover:text-[#018ccf] hover:bg-white duration-150 ease-in-out',
                                                index !== props.activeButton ? '' : 'bg-[#0a4f8b]',
                                            )}
                                            onClick={() => {
                                                const { startDate, endDate } = button.handler(new Date());

                                                props.setState({
                                                    activeButton: index,
                                                    fromDate: startDate,
                                                    toDate: endDate,
                                                });
                                            }}
                                        >
                                            {button.name}
                                        </div>
                                    </Tooltip>
                                ))}
                            </div>
                            <Tooltip title={'Xuất hình ảnh'}>
                                <div
                                    className={clsx(
                                        'mr-1 border border-[#018ccf] text-[10px] py-1.5 px-3 cursor-pointer bg-[#018ccf]',
                                        'text-white hover:text-[#018ccf] hover:bg-white duration-150 ease-in-out',
                                    )}
                                    onClick={() => {
                                        exportDom(title);
                                    }}
                                >
                                    <BaseIcon icon={faDownload} />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="min-h-[450px] relative">
                        {props.isLoading ? (
                            <Loading style={{ height: '450px' }} />
                        ) : (
                            <ReactECharts option={option} style={{ height: '450px' }} />
                        )}
                    </div>
                </div>
            </div>
        </AppContainer>
    );
};

// const NewsChart: React.FC<Props> = props => {
//     return <div className="bg-white">NewsChart</div>;
// };

export default BaseChart;
