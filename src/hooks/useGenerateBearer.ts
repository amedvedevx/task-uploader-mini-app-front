import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { APP_DEV_AUTH, APP_ID, IS_DEV } from '@/app/config';
import { setBearer } from '@/api/state/authorizationSlice';
import { useCreateHashQuery, useGetUserIdQuery } from '@/api/query';

import { useUserRole } from './useUserRole';

export const useGenerateBearer = (): boolean => {
    const [isBearerSet, setIsBearerSet] = useState(false);
    const { data: vkHash } = useCreateHashQuery();
    const { data: userId } = useGetUserIdQuery();
    const userType = useUserRole();
    const dispatch = useDispatch();

    const fetchVkHash = useCallback(() => {
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
    }, [userType, userId, vkHash]);

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
