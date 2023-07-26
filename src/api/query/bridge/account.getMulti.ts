/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

import type { GetMultiAccountResponse } from '@/app/types';

export const BridgeGetMultiAccount = async (
    token: string,
): Promise<GetMultiAccountResponse | 'error'> => {
    const result: GetMultiAccountResponse | 'error' = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'account.getMulti',
            params: {
                access_token: token,
                fields: 'profile_type',
                v: '5.189',
            },
        })
        .then((data: { response: GetMultiAccountResponse }) => data.response)
        .catch((error) => {
            console.error('VKWebAppCallAPIMethod - account.getMulti', error);

            return 'error';
        });

    return result;
};
