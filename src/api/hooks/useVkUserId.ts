import type { ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect } from 'react';

export const useVkUserId = (): number | undefined => {
    const [vkUserId, setVkUserId] = useState<number>();

    useEffect(() => {
        bridge
            .send('VKWebAppGetLaunchParams')
            .then((data) => {
                setVkUserId(data.vk_user_id);
            })
            .catch((error: ErrorData) => {
                // eslint-disable-next-line no-console
                console.error(`Ошибка: ${error.error_type}`, error.error_data);
            });
    }, []);

    return vkUserId;
};
