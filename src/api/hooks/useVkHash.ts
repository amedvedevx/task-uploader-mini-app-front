import { useCallback, useEffect, useState } from 'react';
import type { ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useLocation } from '@happysanta/router';
import { useDispatch } from 'react-redux';

import { APP_DEV_AUTH, APP_ID, IS_DEV } from '@/app/config';
import { setBearer } from '@/api/state/authorizationSlice';
import { UserTypes } from '@/app/types';

export interface VKWebAppCreateHashResult {
    sign: string;
    ts: string;
}

export const useVkHash = (): boolean => {
    const [status, setStatus] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();

    const userType = location.getPageId().includes('upload')
        ? UserTypes.TESTEE
        : UserTypes.ORGANIZER;

    const fetchVkHash = useCallback(async () => {
        const vkHash = await bridge
            .send('VKWebAppCreateHash')
            // eslint-disable-next-line no-console
            .catch((error) => console.error('VKWebAppCreateHash', error));

        const vkUserInfo = await bridge
            .send('VKWebAppGetLaunchParams')
            .catch((error: ErrorData) => {
                // eslint-disable-next-line no-console
                console.error(`Ошибка: ${error.error_type}`, error.error_data);
            });

        if (vkHash && userType && vkUserInfo) {
            dispatch(
                setBearer(
                    `Bearer {"sign": ${JSON.stringify(
                        vkHash.sign,
                    )}, "userId": ${vkUserInfo.vk_user_id.toString()}, "appId": ${APP_ID}, "ts": ${
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
