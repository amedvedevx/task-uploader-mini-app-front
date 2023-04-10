import type {
    GetTesteesResponse,
    GetTesteesProps,
    SendNotificationProps,
    GetChatTesteesProps,
    GetChatTesteesResponse,
    GetAllowedForRemindIdsProps,
    GetAllowedForRemindIdsResponce,
    UpdateAllowedForRemindIdsProps,
} from '@/app/types';
import { UPLOAD_URL } from '@/app/config';

import {
    BridgeGetConversationsMembers,
    BridgeMessagesSend,
    BridgeSearchConversations,
} from './bridge';
import { apiSlice } from './apiSlice';
import type { RootState } from '../store';

const testeesSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ['AllowedRemindIds'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getTestees: builder.query<GetTesteesResponse, GetTesteesProps>({
                queryFn: async ({ search, count, invitedMembersIds }, { getState }) => {
                    const { userInfo } = (getState() as RootState).authorization;

                    let filteredTestees = {} as GetTesteesResponse;

                    const testees = await BridgeSearchConversations({
                        token: userInfo.token,
                        search,
                        count,
                    });

                    filteredTestees = {
                        count: testees.count,
                        items: testees.items.filter(
                            (el) => el.peer.type === 'chat' && !!el.chat_settings.members_count,
                        ),
                        profiles: testees.profiles
                            ? testees.profiles.filter((el) => !invitedMembersIds?.includes(el.id))
                            : [],
                    };

                    return { data: filteredTestees };
                },
            }),

            getChatTestees: builder.query<GetChatTesteesResponse[], GetChatTesteesProps>({
                queryFn: async ({ chats, invitedMembersIds }, { getState }) => {
                    const { userInfo } = (getState() as RootState).authorization;

                    const convMembers: GetChatTesteesResponse[] = [];

                    const promises = chats.map(async ({ peer, chat_settings }) => {
                        const result = await BridgeGetConversationsMembers({
                            token: userInfo.token,
                            peerId: peer.id,
                            chatName: chat_settings.title,
                            invitedMembersIds,
                        });

                        return result;
                    });

                    await Promise.allSettled(promises).then((results) => {
                        results.forEach((result) => convMembers.push(result.value));
                    });

                    return { data: convMembers };
                },
            }),
            getAllowedForRemindIds: builder.query<
                GetAllowedForRemindIdsResponce,
                GetAllowedForRemindIdsProps
            >({
                query: ({ taskId }) => ({
                    url: `/task-result/get-users-for-notification/${taskId}`,
                }),
                providesTags: (result, error, arg) => [
                    { type: 'AllowedRemindIds', id: arg.taskId },
                ],
            }),

            updateAllowedForRemindIds: builder.mutation<void, UpdateAllowedForRemindIdsProps>({
                query: ({ userIds, taskId }) => ({
                    url: `/task-result/set-send-notification/${taskId}`,
                    params: { userIds },
                    method: 'POST',
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'AllowedRemindIds', id: arg.taskId },
                ],
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

export const {
    useGetTesteesQuery,
    useGetChatTesteesQuery,
    useSendNotificationMutation,
    useGetAllowedForRemindIdsQuery,
    useUpdateAllowedForRemindIdsMutation,
} = testeesSlice;
