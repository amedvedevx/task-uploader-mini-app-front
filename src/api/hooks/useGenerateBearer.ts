import { useCallback, useEffect, useState } from 'react';
import type { CreateHashResponse } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch, useSelector } from 'react-redux';

import { APP_DEV_AUTH, APP_ID, IS_DEV } from '@/app/config';
import { setBearer } from '@/api/state/authorizationSlice';

import { useUserRole } from './useUserRole';
import type { RootState } from '../store';

export interface VKWebAppCreateHashResult extends CreateHashResponse {
    sign: string;
}

export const useGenerateBearer = (): boolean => {
    const [isBearerSet, setIsBearerSet] = useState(false);

    const dispatch = useDispatch();

    const userType = useUserRole();

    const { userId } = useSelector((state: RootState) => state.authorization.userInfo);

    const fetchVkHash = useCallback(async () => {
        // TODO ME-41476 - refactor bridge calls to api layer
        const vkHash = await bridge
            .send('VKWebAppCreateHash')
            .then((data) => data as VKWebAppCreateHashResult)
            // eslint-disable-next-line no-console
            .catch((error) => console.error('VKWebAppCreateHash', error));

        const authorizationBearerData = vkHash && userType && userId;

        if (authorizationBearerData) {
            dispatch(
                setBearer(
                    `Bearer {"sign": ${JSON.stringify(
                        vkHash.sign,
                    )}, "userId": ${userId.toString()}, "appId": ${APP_ID}, "ts": ${
                        vkHash.ts
                    }, "role": "${userType}"}`,
                ),
            );
            setIsBearerSet(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType, userId]);

    useEffect(() => {
        if (IS_DEV) {
            dispatch(setBearer(`${APP_DEV_AUTH}"${userType}"}`));
            setIsBearerSet(true);
        } else {
            fetchVkHash();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchVkHash]);

    return isBearerSet;
};
