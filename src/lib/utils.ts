import { format, fromUnixTime } from 'date-fns';
import { ru } from 'date-fns/locale';
import copy from 'copy-to-clipboard';
import { EGetLaunchParamsResponsePlatforms } from '@vkontakte/vk-bridge';

import { UPLOAD_URL } from '@/app/config';
import type { TesteeType, TaskResults, TaskType } from '@/app/types';
import { TaskStatusTypesForTestee } from '@/app/types';

export const capitalizeString = (stringToCap: string): string =>
    stringToCap[0].toUpperCase() + stringToCap.slice(1);

export const inclinationWord = (quanty: number, words: string[]): string => {
    const n = Math.trunc(Math.abs(Number(quanty)));
    const cases = [2, 0, 1, 1, 1, 2];

    return words[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]];
};

export const parseFileSize = (size: number): string => {
    let counter = 0;
    let sizeCopy = size;

    while (sizeCopy >= 1024) {
        sizeCopy /= 1024;
        counter++;
    }

    enum SizeType {
        MB = 2,
        KB = 1,
        B = 0,
    }

    return `${Math.ceil(sizeCopy)} ${SizeType[counter]}`;
};

export const getFileExtension = (fileName: string): string =>
    fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

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

export const isForbiddenFile = (fileName: string): boolean => {
    const forbiddenFileExtension = [
        'app',
        'bat',
        'cmd',
        'com',
        'csh',
        'exe',
        'fxp',
        'gadget',
        'jar',
        'msi',
        'mst',
        'pif',
        'prg',
        'pyo',
        'reg',
        'scr',
        'shb',
        'shs',
        'vb',
        'vbe',
        'vbs',
        'ws',
        'wsf',
        'vbscript',
        'obs',
        'apk',
        'action',
    ];

    const fileExt = getFileExtension(fileName);

    return forbiddenFileExtension.includes(fileExt);
};

export const copyUploadLinkToClipboard = (task: TaskType): boolean => {
    const link = `Вы были приглашены пользователем ${
        task.owner.fullName
    } для загрузки файлов по заданию: ${task.name}. ${
        task.description ? `\n Описание: ${task.description}.` : ''
    } \n ${UPLOAD_URL}${task.id}`;

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

export const normalizeTestees = (
    taskResultsArg: TaskResults[],
): { completed: TaskResults[]; notCompleted: TaskResults[] } => {
    const testees = {
        completed: [],
        notCompleted: [],
    };
    taskResultsArg.forEach((result) => {
        if (
            result.taskResultStatus === TaskStatusTypesForTestee.UPLOADED ||
            result.taskResultStatus === TaskStatusTypesForTestee.COMPLETED
        ) {
            testees.completed.push(result);

            return;
        }

        testees.notCompleted.push(result);
    });

    return testees;
};

export const normalizeMembers = (members: TesteeType[]): TesteeType[] =>
    members.reduce((o: TesteeType[], i) => {
        if (!o.find((v) => v.id === i.id)) {
            o.push(i);
        }

        return o;
    }, []);

export const errorParser = (errorNumber: number): string => {
    let result;
    switch (errorNumber) {
        case 404:
            result = 'Такого сбора не существует';
            break;

        case 401:
            result = 'Вы не являетесь создателем сбора. Доступ запрещен';
            break;

        default:
            result = 'Произошла ошибка. Попробуйте еще раз';
            break;
    }

    return result;
};

export const checkIsMobilePlatform = (platform: string): boolean => {
    const desktopTypes = [
        EGetLaunchParamsResponsePlatforms.DESKTOP_WEB,
        EGetLaunchParamsResponsePlatforms.MOBILE_WEB,
        'desktop_web_messenger',
        // this type returned by bridge is not consistent with bridge documentation, its 'mvk_external'
        'mkv_external',
        'web_external',
    ];

    return !desktopTypes.includes(platform);
};

type CustomError = {
    message: string;
    onReset: () => void;
    resetMessage: string;
};

export const createErrorHandler = (error: Error, resetErrorBoundary: () => void): CustomError => {
    const failedImportedError = 'Failed to fetch dynamically imported module';

    const normalizedError = {
        message: error.message || 'Что-то пошло не так',
        onReset: () => {
            resetErrorBoundary();

            if (window.navigator.onLine) {
                window.location.reload();
            }
        },
        resetMessage: 'Попробовать еще раз',
    };

    if (error.message.includes(failedImportedError)) {
        normalizedError.message = 'Потеряно соединение с сервером';
    }

    return normalizedError;
};
