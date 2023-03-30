import bridge from '@vkontakte/vk-bridge';

import type { FriendsType, GetTesteesProps, GetTesteesResponse } from '@/app/types';

import { apiSlice } from './apiSlice';
import type { RootState } from '../store';

type ConversationMember = {
    member_id: number;
    invited_by: number;
    join_date: number;
    is_admin: boolean;
    can_kick: boolean;
};

export type ConversationMembers = {
    count: number;
    items: ConversationMember[];
    chat_restrictions: {
        admins_promote_users: boolean;
        only_admins_edit_info: boolean;
        only_admins_edit_pin: boolean;
        only_admins_invite: boolean;
        only_admins_kick: boolean;
    };
    profiles: FriendsType[];
    groups: unknown[];
};

const testeesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestees: builder.query<GetTesteesResponse, GetTesteesProps>({
            queryFn: async ({ search, count }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const testees = await bridge
                    .send('VKWebAppCallAPIMethod', {
                        method: 'messages.searchConversations',
                        params: {
                            access_token: userInfo.token,
                            q: search,
                            count,
                            extended: 1,
                            v: '5.131',
                            fields: 'photo_100',
                        },
                    })
                    .then((data: { response: GetTesteesResponse }) => data.response);

                return { data: testees };
            },
        }),

        getConversationsTestees: builder.query<
            ConversationMembers[],
            { conversationsIds: number[] }
        >({
            queryFn: async ({ conversationsIds }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const convMembers: ConversationMembers[] = [];

                const promises = conversationsIds.map(async (conversId: number) => {
                    const result = await bridge
                        .send('VKWebAppCallAPIMethod', {
                            method: 'messages.getConversationMembers',
                            params: {
                                access_token: userInfo.token,
                                peer_id: conversId,
                                v: '5.131',
                            },
                        })
                        .then((data: { response: ConversationMembers }) =>
                            data.response.profiles.slice(0, 50),
                        )
                        .catch((err) => err);

                    return result;
                });

                await Promise.allSettled(promises).then((results) => {
                    results.forEach((result) => convMembers.push(result.value));
                });

                return { data: convMembers };
            },
        }),
    }),
});

export const { useGetTesteesQuery, useGetConversationsTesteesQuery } = testeesSlice;
