import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';

import { setError } from '@/api/state';

import vkHostingConfig from '../../vk-hosting-config.json';

export const useVkToken = (): string | undefined => {
    const [accessToken, setAccessToken] = useState<string>();
    const dispatch = useDispatch();

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
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('VKWebAppGetAuthToken', error);

                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (error?.error_type === 'auth_error') {
                    dispatch(
                        setError({
                            type: 'api-messages',
                            text: 'Данный функционал временно недоступен',
                        }),
                    );
                }
            });
    }, []);

    return accessToken;
};
