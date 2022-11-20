import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';
// import loadable from '@loadable/component';
import { getInstanceByDom, init } from 'echarts';
// const { getInstanceByDom, init } = loadable.lib(() => import('echarts'));
import type { CSSProperties } from 'react';
import React, { RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import { bind } from 'size-sensor';
export interface ReactEChartsProps {
    option: EChartsOption;
    style?: CSSProperties;
    settings?: SetOptionOpts;
    loading?: boolean;
    theme?: 'light' | 'dark';
    onChartReady?: (chartInstance: ECharts) => void;
    wrapperRef?: RefObject<HTMLDivElement>;
}
type EchartInstance = ECharts | undefined | null;
export interface ReactEChartsRef {
    getChartInstance: () => EchartInstance;
    reRender: (option: EChartsOption, renderOptions?: SetOptionOpts) => void;
}
export const ReactECharts = React.forwardRef<ReactEChartsRef, ReactEChartsProps>((props, ref) => {
    const { option, style, settings, loading, theme = 'light', onChartReady, wrapperRef } = props;
    const chartRef = useRef<HTMLDivElement>(null);
    const isBindingSensor = useRef<boolean>(false);

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null) {
            chart = init(chartRef.current, theme);
        }

        // Add chart resize listener
        // ResizeObserver is leading to a bit janky UX
        function resizeChart() {
            chart?.resize();
        }
        window.addEventListener('resize', resizeChart);

        // Return cleanup function
        return () => {
            chart?.dispose();
            window.removeEventListener('resize', resizeChart);
        };
    }, [theme]);

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(option, settings);
        }
    }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
    }, [loading, theme]);

    useEffect(() => {
        if (chartRef.current && wrapperRef?.current && isBindingSensor.current === false) {
            const chartInstance = getChartInstance();
            bind(wrapperRef.current, () => {
                try {
                    chartInstance?.resize();
                } catch (e) {
                    console.warn('Can not resize chart with err:' + e);
                }
            });
            isBindingSensor.current = true;
        }
    }, [chartRef.current, wrapperRef?.current, isBindingSensor.current]);

    const getChartInstance = () => {
        return (
            (chartRef.current && getInstanceByDom(chartRef.current)) ||
            ((chartRef.current && init(chartRef.current, theme, { renderer: 'svg' })) as EchartInstance)
        );
    };

    const reRender = (option: EChartsOption, renderOptions?: SetOptionOpts) => {
        const chartInstance = getChartInstance();
        if (chartInstance) {
            chartInstance.showLoading();
            chartInstance.setOption(option, renderOptions);
            //on chart ready
            onChartReady?.(chartInstance);

            // if (wrapperRef?.current) {
            //     console.log('first');
            //     bind(wrapperRef.current, () => {
            //         console.log('se');
            //         try {
            //             console.log('thre');

            //             chartInstance.resize();
            //         } catch (e) {
            //             console.warn('Can not resize chart with err:' + e);
            //         }
            //     });
            // }

            setTimeout(() => {
                chartInstance.hideLoading();
            }, 250);
        }
    };

    useImperativeHandle(ref, () => ({
        getChartInstance,
        reRender,
    }));

    return <div ref={chartRef} style={{ width: '100%', height: '100%', ...style }} />;
});

ReactECharts.displayName = 'ReactECharts';
