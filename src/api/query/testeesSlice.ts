import type {
    GetTesteesResponse,
    GetTesteesProps,
    SendNotificationProps,
    GetChatTesteesProps,
    GetAllowedForRemindIdsProps,
    GetAllowedForRemindIdsResponce,
    UpdateAllowedForRemindIdsProps,
    TesteeType,
} from '@/app/types';
import { UPLOAD_URL } from '@/app/config';

import type { BridgeMessagesSendResponce } from './bridge';
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
                queryFn: async ({ search, count, invitedMemberIds }, { getState }) => {
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
                            ? testees.profiles.filter(
                                (el) =>
                                    !invitedMemberIds?.includes(el.id) &&
                                      el.id !== userInfo.userId,
                            )
                            : [],
                    };

                    return { data: filteredTestees };
                },
            }),

            getChatTestees: builder.query<TesteeType[], GetChatTesteesProps>({
                queryFn: async ({ selectedChats, invitedMemberIds }, { getState }) => {
                    const { userInfo } = (getState() as RootState).authorization;

                    const convMembers: TesteeType[] = [];

                    const promises = selectedChats.map(async ({ peer, chat_settings }) => {
                        const result = await BridgeGetConversationsMembers({
                            token: userInfo.token,
                            peerId: peer.id,
                        });

                        const dataWithAddFields = result.map((item) => ({
                            ...item,
                            groupName: chat_settings.title,
                            full_name: `${item.first_name} ${item.last_name}`,
                        }));

                        return dataWithAddFields.filter(
                            (member) => !invitedMemberIds?.includes(member.id),
                        );
                    });

                    await Promise.allSettled(promises).then((results) => {
                        results.forEach((result) => convMembers.push(result?.value));
                    });

                    return { data: convMembers.flat() };
                },
            }),
            getAllowedForRemindIds: builder.query<
                GetAllowedForRemindIdsResponce,
                GetAllowedForRemindIdsProps
            >({
                query: ({ taskId, userIds }) => ({
                    url: `/task-result/get-users-for-notification/${taskId}`,
                    params: { userIds },
                }),
                providesTags: () => ['AllowedRemindIds'],
            }),

            updateAllowedForRemindIds: builder.mutation<void, UpdateAllowedForRemindIdsProps>({
                query: ({ userIds, taskId }) => ({
                    url: `/task-result/set-send-notification/${taskId}`,
                    params: { userIds },
                    method: 'POST',
                }),
                invalidatesTags: () => ['AllowedRemindIds'],
            }),

            sendNotification: builder.mutation<BridgeMessagesSendResponce, SendNotificationProps>({
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

                    return { data: result };
                },
                invalidatesTags: () => ['AllowedRemindIds'],
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
