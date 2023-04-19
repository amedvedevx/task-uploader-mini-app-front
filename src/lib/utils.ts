import { format, fromUnixTime } from 'date-fns';
import { ru } from 'date-fns/locale';
// eslint-disable-next-line import/no-extraneous-dependencies
import copy from 'copy-to-clipboard';

import { UPLOAD_URL } from '@/app/config';
import type { TesteeType, TaskResults, TaskType } from '@/app/types';
import { TaskStatusTypesForTestee } from '@/app/types';

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

export const copyUploadLinkToClipboard = (task: TaskType): boolean => {
    const link = `Вы были приглашены пользователем ${task.owner.fullName} для загрузки файлов по заданию: ${task.name}. \n ${UPLOAD_URL}${task.id}`;

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
