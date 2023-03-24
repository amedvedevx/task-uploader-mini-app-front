import type { ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect, useRef, useTransition } from 'react';

import { APP_ID } from '@/app/config';

export const useVkUserId = (token: string | undefined): number | undefined => {
    const [vkUserId, setVkUserId] = useState<number>();
    const [, startTransition] = useTransition();
    const isFetching = useRef<boolean>(false);

    useEffect(() => {
        if (!token || isFetching.current) {
            return;
        }

        isFetching.current = true;

        bridge
            .send('VKWebAppCallAPIMethod', {
                method: 'account.getMulti',
                params: {
                    access_token: token,
                    v: '5.203',
                    miniapp_id: APP_ID,
                    fields: 'profile_type',
                },
            })
            .then(
                (data: {
                    response: {
                        items: Array<{
                            id: number;
                            profile_type: number;
                        }>;
                    };
                }) => {
                    const trainingAccount = data?.response?.items.find(
                        (item) => item.profile_type === 2,
                    );

                    startTransition(() => {
                        if (trainingAccount) {
                            setVkUserId(trainingAccount.id);
                        } else {
                            setVkUserId(data?.response?.items[0].id);
                        }
                    });
                },
            )
            .catch((error: ErrorData) => {
                console.log('account.getMulti error', error);
            });
    }, [token]);

    return vkUserId;
};
