import { format, fromUnixTime } from 'date-fns';
import { ru } from 'date-fns/locale';

export const capitalizeString = (stringToCap: string): string =>
    stringToCap[0].toUpperCase() + stringToCap.slice(1);

export const inclinationWord = (quanty: number): string => {
    if (quanty === 1) return 'файл';

    if (quanty <= 4) return 'файла';

    if (quanty > 4) return 'файлов';

    return '';
};

export const parseFileSize = (size: number): string => {
    let counter = 0;

    while (size >= 1024) {
        size /= 1024;
        counter++;
    }

    enum SizeType {
        MB = 2,
        KB = 1,
        B = 0,
    }

    return `${Math.ceil(size)} ${SizeType[counter]}`;
};

export const getFileExtension = (fileName: string): string =>
    fileName.substring(fileName.indexOf('.') + 1).toUpperCase();

export const formatFileDate = (unixTime: number): string =>
    format(fromUnixTime(unixTime / 1000), 'd MMM', { locale: ru });
