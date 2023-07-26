import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/api';
import { getEduAccountStatus } from '@/utils';

// бросает ошибку при попытке открыть учебный сбор из обычного аккаунта и наоборот
export const useEduCheck = (isEduFlag: boolean | undefined): void => {
    const { bearer } = useSelector((state: RootState) => state.authorization);
    const userIsEdu = getEduAccountStatus(bearer);

    useEffect(() => {
        if (isEduFlag !== undefined && userIsEdu !== undefined && userIsEdu !== isEduFlag) {
            throw Error('Доступ запрещён.');
        }
    });
};
