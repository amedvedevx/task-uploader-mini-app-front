/* eslint-disable no-console */
import type { CreateHashResponse } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';

export interface VKWebAppCreateHashResult extends CreateHashResponse {
    sign: string;
}

export const BridgeCreateHash = async (): Promise<VKWebAppCreateHashResult | 'error'> => {
    const result: VKWebAppCreateHashResult | 'error' = await bridge
        .send('VKWebAppCreateHash')
        .then((data) => data as VKWebAppCreateHashResult)
        .catch((error) => {
            console.error('VKWebAppCreateHash', error);

            return 'error';
        });

    return result;
};
