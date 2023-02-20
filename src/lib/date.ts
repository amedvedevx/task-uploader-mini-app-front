// eslint-disable-next-line import/no-duplicates
import { addYears, format, getDayOfYear, getYear, parse, startOfDay, subYears } from 'date-fns/esm';
// eslint-disable-next-line import/no-duplicates
import { ru } from 'date-fns/esm/locale';

export const DMYDoteDate = 'dd.MM.yyyy';
export const DMYDashedDate = 'dd-MM-yyyy';
export const YMDDashedDate = 'yyyy-MM-dd';
export const MDDoteDate = 'EEEE dd.MM';

export const parseFn = (
    dateString: string,
    formatString: string,
    referenceDate: Date,
): Date | null => {
    if (checkIsDateValidWrapper(dateString)) {
        return parse(dateString, formatString, referenceDate, { locale: ru });
    }

    return null;
};

export const formatFn = (date: Date, formatString: string): string => {
    if (checkIsDateValidWrapper(date)) {
        return format(date, formatString, { locale: ru });
    }

    return '';
};

export const getTimeWithoutSeconds = (timeString: string): string => {
    const date = parseFn(timeString, 'HH:mm:ss', new Date());

    if (date) {
        return formatFn(date, 'HH:mm');
    }

    return '';
};

export const getYearMonthDayDate = (date: Date): string => formatFn(date, YMDDashedDate);

export const getMonthAndDayDate = (dateString: string): string => {
    const date = parseFn(dateString, YMDDashedDate, new Date());

    if (date) {
        return formatFn(date, MDDoteDate);
    }

    return '';
};

export const getDateWithMidnightTime = startOfDay(new Date());

const checkIsDateValidWrapper = (date: string | Date) => date instanceof Date || date?.length > 0;

export const calculateCurrentStudyYear = (): Date[] => {
    const curDay = new Date();
    const curYear = getYear(new Date());
    const prevYear = subYears(curDay, 1);
    const nextYear = addYears(curDay, 1);
    const dayOfYear = getDayOfYear(curDay);
    const LastJulyDay = 212;
    let result;

    if (dayOfYear > LastJulyDay) {
        result = [new Date(curYear, 7, 1), new Date(getYear(nextYear), 6, 31)];
    } else {
        result = [new Date(getYear(prevYear), 7, 1), new Date(curYear, 6, 31)];
    }

    return result;
};
