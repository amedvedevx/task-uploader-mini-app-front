import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { APP_DEV_AUTH, APP_ID, IS_DEV } from '@/app/config';
import { setBearer } from '@/api/state/authorizationSlice';
import { useCreateHashQuery, useGetMultiAccountQuery, useGetUserIdQuery } from '@/api/query';

import { useUserRole } from './useUserRole';

export const useGenerateBearer = (token: string | undefined): boolean => {
    const [isBearerSet, setIsBearerSet] = useState(false);
    const { data: vkHash } = useCreateHashQuery();
    const { data: userId } = useGetUserIdQuery();
    const { data: multiAccount } = useGetMultiAccountQuery({ token }, { skip: !token });
    const userType = useUserRole();
    const dispatch = useDispatch();

    const isEduAccount = () => {
        const curAcc = multiAccount?.items.find((account) => account.id === userId);

        return curAcc?.profile_type === 2 ? 'true' : 'false';
    };

    const fetchVkHash = useCallback(() => {
        const authorizationBearerData = vkHash && userType && userId && multiAccount;

        if (authorizationBearerData) {
            dispatch(
                setBearer(
                    `Bearer {"sign": ${JSON.stringify(
                        vkHash.sign,
                    )}, "userId": ${userId.toString()}, "appId": ${APP_ID}, "ts": ${
                        vkHash.ts
                    }, "role": "${userType}", "is_edu": "${isEduAccount()}"}`,
                ),
            );
            setIsBearerSet(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType, userId, vkHash, multiAccount]);

    useEffect(() => {
        if (IS_DEV) {
            dispatch(setBearer(`${APP_DEV_AUTH}"${userType}", "is_edu": "false"}`));
            setIsBearerSet(true);
        } else {
            fetchVkHash();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchVkHash]);

    return isBearerSet;
};
