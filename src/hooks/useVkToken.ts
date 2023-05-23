import { useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';

import { setError, setUserToken } from '@/api/state';

import vkHostingConfig from '../../vk-hosting-config.json';

export const useVkToken = (): void => {
    const dispatch = useDispatch();

    useEffect(() => {
        // TODO ME-41476 - refactor bridge calls to api layer
        bridge
            .send('VKWebAppGetAuthToken', {
                app_id: vkHostingConfig.app_id,
                scope: 'messages,docs',
            })
            .then((data) => {
                dispatch(setUserToken({ token: data.access_token }));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
