import { format, fromUnixTime } from 'date-fns';
import { ru } from 'date-fns/locale';
// eslint-disable-next-line import/no-extraneous-dependencies
import copy from 'copy-to-clipboard';

import { APP_ID } from '@/app/config';

export const capitalizeString = (stringToCap: string): string =>
    stringToCap[0].toUpperCase() + stringToCap.slice(1);

export const inclinationWord = (quanty: number, words: string[]): string => {
    if (quanty === 1) return words[0];

    if (quanty <= 4) return words[1];

    if (quanty > 4) return words[2];

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
    fileName.substring(fileName.indexOf('.') + 1).toLowerCase();

export const formatFileDate = (unixTime: number): string =>
    format(fromUnixTime(unixTime / 1000), 'd MMM', { locale: ru });

export const getInitials = (string: string): string => {
    const result = string
        .split(' ')
        .map((word) => word.toLocaleUpperCase().substring(0, 1))
        .slice(0, 2)
        .join('');

    return result;
};

export const getExtenstionInitials = (fileName: string): string =>
    getFileExtension(fileName).slice(0, 3).toUpperCase();

export const copyUploadLinkToClipboard = (text: string): boolean => {
    const link = `https://vk.com/app${APP_ID}/#/upload/${text}`;

    if (!navigator?.clipboard) {
        return false;
    }

    try {
        copy(link);

        return true;
    } catch (error) {
        return false;
    }
};
