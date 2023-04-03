import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';

import vkHostingConfig from '../../vk-hosting-config.json';

export const useVkToken = (): string | undefined => {
    const [accessToken, setAccessToken] = useState<string>();

    useEffect(() => {
        bridge
            .send('VKWebAppGetAuthToken', {
                app_id: vkHostingConfig.app_id,
                scope: 'messages',
            })
            .then((data) => {
                if (data.access_token) {
                    setAccessToken(data.access_token);
                }
            })
            .catch((error) => console.log('VKWebAppGetAuthToken', error));
    }, []);

    return accessToken;
};
