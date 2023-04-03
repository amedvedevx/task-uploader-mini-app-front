import type { GetTesteesProps, GetTesteesResponse, FriendsType, ItemsType } from '@/app/types';

import { apiSlice } from './apiSlice';
import type { RootState } from '../store';
import { searchConversations } from '../bridge/seacrhConversations';
import { getConversationsMembers } from '../bridge/getConversationsMembers';

const testeesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestees: builder.query<GetTesteesResponse, GetTesteesProps>({
            queryFn: async ({ search, count }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const testees = await searchConversations(userInfo.token, search, count);

                return { data: testees };
            },
        }),

        getConversationsTestees: builder.query<
            { chatName: string; members: FriendsType[] }[],
            { conversations: ItemsType[] }
        >({
            queryFn: async ({ conversations }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                const convMembers: { chatName: string; members: FriendsType[] }[] = [];

                const promises = conversations.map(async ({ peer, chat_settings }) => {
                    const result = getConversationsMembers(
                        userInfo.token,
                        peer.id,
                        chat_settings.title,
                    );

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
