import moment from 'moment';
import DateTimeUtil from '~/util/DateTimeUtil';

type ButtonFilter = {
    tooltip: string;
    name: string;
    handler: (now: Date) => { startDate: string; endDate: string };
};

export const listExtraButtonFilter: ButtonFilter[] = [
    {
        tooltip: '3 Ngày',
        handler: now => {
            return {
                startDate: moment(now).add(-2, 'days').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '3N',
    },
    {
        tooltip: '7 Ngày',
        handler: now => {
            return {
                startDate: moment(now).add(-6, 'days').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '7N',
    },
];

export const listButtonFilter: ButtonFilter[] = [
    {
        tooltip: '1 Tháng',
        handler: now => {
            return {
                startDate: moment(now).add(-1, 'months').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '1T',
    },
    {
        tooltip: '3 Tháng',
        handler: now => {
            return {
                startDate: moment(now).add(-3, 'months').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '3T',
    },
    {
        tooltip: '6 Tháng',
        handler: now => {
            return {
                startDate: moment(now).add(-6, 'months').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '6T',
    },
    {
        tooltip: '1 Năm',
        handler: now => {
            return {
                startDate: moment(now).add(-1, 'years').format(DateTimeUtil.YmdFormat),
                endDate: moment(now).format(DateTimeUtil.YmdFormat),
            };
        },
        name: '1 Năm',
    },
];
