/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

export const BridgeGetUserId = async (): Promise<number | 'error'> => {
    const result: number | 'error' = await bridge
        .send('VKWebAppGetLaunchParams')
        .then((data) => data.vk_user_id)
        .catch((error) => {
            console.error('VKWebAppGetLaunchParams', error);

            return 'error';
        });

    return result;
};
