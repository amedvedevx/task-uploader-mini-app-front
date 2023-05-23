/* eslint-disable no-console */
import type { ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setUserId } from '@/api/state';

export const useVkUserId = (): void => {
    const dispatch = useDispatch();

    useEffect(() => {
        // TODO ME-41476 - refactor bridge calls to api layer
        bridge
            .send('VKWebAppGetLaunchParams')
            .then((data) => {
                dispatch(setUserId({ userId: data.vk_user_id }));
            })
            .catch((error: ErrorData) => {
                // eslint-disable-next-line no-console
                console.error(`Ошибка: ${error.error_type}`, error.error_data);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
