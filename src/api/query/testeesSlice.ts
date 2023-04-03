import type {
    GetTesteesResponse,
    GetTesteesProps,
    SendNotificationProps,
    GetChatTesteesProps,
    GetChatTesteesResponse,
} from '@/app/types';
import { UPLOAD_URL } from '@/app/config';

import {
    BridgeGetConversationsMembers,
    BridgeMessagesSend,
    BridgeSearchConversations,
} from './bridge';
import { apiSlice } from './apiSlice';
import type { RootState } from '../store';

const testeesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestees: builder.query<GetTesteesResponse, GetTesteesProps>({
            queryFn: async ({ search, count }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const testees = await BridgeSearchConversations({
                    token: userInfo.token,
                    search,
                    count,
                });

                return { data: testees };
            },
        }),

        getChatTestees: builder.query<GetChatTesteesResponse[], GetChatTesteesProps>({
            queryFn: async ({ chats }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const convMembers: GetChatTesteesResponse[] = [];

                const promises = chats.map(async ({ peer, chat_settings }) => {
                    const result = await BridgeGetConversationsMembers({
                        token: userInfo.token,
                        peerId: peer.id,
                        chatName: chat_settings.title,
                    });

                    return result;
                });

                await Promise.allSettled(promises).then((results) => {
                    results.forEach((result) => convMembers.push(result.value));
                });

                return { data: convMembers };
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

export const { useGetTesteesQuery, useGetChatTesteesQuery, useSendNotificationMutation } =
    testeesSlice;
