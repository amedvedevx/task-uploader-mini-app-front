import { useCallback, useEffect, useState } from 'react';
import type { ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';

import { APP_DEV_AUTH, APP_ID, IS_DEV } from '@/app/config';
import { setBearer } from '@/api/state/authorizationSlice';
import { useVkUserId } from '@/hooks';

import { useUserRole } from './useUserRole';

export interface VKWebAppCreateHashResult {
    sign: string;
    ts: string;
}

export const useVkHash = (token: string | undefined): boolean => {
    const [status, setStatus] = useState(false);

    const dispatch = useDispatch();

    const userType = useUserRole();
    const vkUserId = useVkUserId(token);

    const fetchVkHash = useCallback(async () => {
        const vkHash = await bridge
            .send('VKWebAppCreateHash')
            // eslint-disable-next-line no-console
            .catch((error) => console.error('VKWebAppCreateHash', error));

        if (vkHash && userType && vkUserId) {
            dispatch(
                setBearer(
                    `Bearer {"sign": ${JSON.stringify(
                        vkHash.sign,
                    )}, "userId": ${vkUserId.toString()}, "appId": ${APP_ID}, "ts": ${
                        vkHash.ts
                    }, "role": "${userType}"}`,
                ),
            );
            setStatus(true);
        }
    }, []);

    useEffect(() => {
        if (IS_DEV) {
            dispatch(setBearer(`${APP_DEV_AUTH}"${userType}"}`));
            setStatus(true);
        } else {
            fetchVkHash();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchVkHash]);

    return status;
};
