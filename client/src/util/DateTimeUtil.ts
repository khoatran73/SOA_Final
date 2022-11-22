import { Moment } from 'moment';
import moment from 'moment-with-locales-es6';

type Base =
    | 'year'
    | 'years'
    | 'y'
    | 'month'
    | 'months'
    | 'M'
    | 'week'
    | 'weeks'
    | 'w'
    | 'day'
    | 'days'
    | 'd'
    | 'hour'
    | 'hours'
    | 'h'
    | 'minute'
    | 'minutes'
    | 'm'
    | 'second'
    | 'seconds'
    | 's'
    | 'millisecond'
    | 'milliseconds'
    | 'ms';
type _quarter = 'quarter' | 'quarters' | 'Q';
type Diff = Base | _quarter;

export default class DateTimeUtil {
    static DmyFormat = 'DD/MM/YYYY';
    static DmyHmsFormat = 'DD/MM/YYYY HH:mm:ss';
    static HmsDmyFormat = 'HH:mm:ss DD/MM/YYYY';
    static YmdFormat = 'YYYY-MM-DD'
    static OneDayByMilliSecond = 86400000;

    static diffTwoStringDate = (source: string, target: string, diff: Diff = 'ms') => {
        const sourceDate = moment(source);
        const targetDate = moment(target);

        return sourceDate.diff(targetDate, diff);
    };

    static diffTwoMomentDate = (source: Moment, target: Moment, diff: Diff = 'ms') => source.diff(target, diff);

    static checkExpirationDate = (source: string | Moment | undefined | Date, diff: Diff = 'ms') => {
        const sourceDate = moment(source);
        const now = moment();

        if (sourceDate.diff(now, diff) > 0) return true;
        return false;
    };

    static fromNow = (source: string | Moment | Date | undefined) => {
        const sourceDate = moment(source);
        const now = moment();

        if (now.diff(sourceDate) > (this.OneDayByMilliSecond * 3)) {
            return sourceDate.locale('vi').format(this.DmyHmsFormat);
        } else {
            return sourceDate.locale('vi').fromNow();
        }
    };
}
