/* eslint-disable no-console */
import type { EGetLaunchParamsResponsePlatforms, ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';

export const BridgeGetPlatform = async (): Promise<EGetLaunchParamsResponsePlatforms | 'error'> => {
    const result: EGetLaunchParamsResponsePlatforms | 'error' = await bridge
        .send('VKWebAppGetLaunchParams')
        .then((data) => data.vk_platform)
        .catch((error: ErrorData) => {
            console.error('VKWebAppGetLaunchParams', error);

            return 'error';
        });

    return result;
};
