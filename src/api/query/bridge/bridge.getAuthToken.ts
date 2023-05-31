/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

import { APP_ID } from '@/app/config';

export const BridgeGetAuthToken = async (): Promise<string | 'error'> => {
    const result: string | 'error' = await bridge
        .send('VKWebAppGetAuthToken', {
            app_id: Number(APP_ID),
            scope: 'messages,docs',
        })
        .then((data) => data.access_token)
        .catch((error) => {
            console.log('VKWebAppGetAuthToken', error);

            return 'error';
        });

    return result;
};
