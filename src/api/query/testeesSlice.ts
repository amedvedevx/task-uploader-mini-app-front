import bridge from '@vkontakte/vk-bridge';

import type { FriendsType, GetTesteesProps, SendNotificationProps } from '@/app/types';
import { UPLOAD_URL } from '@/app/config';

import { apiSlice } from './apiSlice';
import type { RootState } from '../store';
import { BridgeMessagesSend } from './bridge';

const testeesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestees: builder.query<FriendsType[], GetTesteesProps>({
            queryFn: async ({ search, count, invitedMembers }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const testees = await bridge
                    .send('VKWebAppCallAPIMethod', {
                        method: 'friends.search',
                        params: {
                            access_token: userInfo.token,
                            user_id: Number(userInfo.userId),
                            q: search,
                            v: '5.131',
                            fields: 'photo_100',
                            count,
                        },
                    })
                    .then((data: { response: { items: FriendsType[] } }) => data.response.items);

                if (invitedMembers) {
                    return { data: testees.filter((el) => !invitedMembers.includes(el.id)) };
                }

                return { data: testees };
            },
        }),
        sendNotification: builder.mutation<void, SendNotificationProps>({
            queryFn: async ({ whoToSend, taskName, ownerName, taskId }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const normalizeMembers = whoToSend.join();
                const inviteMesage = `Вы были приглашены пользователем ${ownerName} для загрузки файлов по заданию: ${taskName}. \n ${UPLOAD_URL}${taskId}`;

                const result = await BridgeMessagesSend({
                    token: userInfo.token,
                    peers: normalizeMembers,
                    message: inviteMesage,
                    taskId,
                });

                if (result === 'success') {
                    return { data: 'success' };
                }

                return { error: 'error' };
            },
        }),
    }),
});

export const { useGetTesteesQuery, useSendNotificationMutation } = testeesSlice;
