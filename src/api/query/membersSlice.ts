import bridge from '@vkontakte/vk-bridge';

import type { FriendsType, GetMembersProps } from '@/app/types';

import { apiSlice } from './apiSlice';
import type { RootState } from '../store';

const membersSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMembers: builder.query<FriendsType[], GetMembersProps>({
            queryFn: async ({ search, count }, { getState }) => {
                const { userInfo } = (getState() as RootState).authorization;

                console.log(userInfo);

                const friends = await bridge
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

                return { data: friends };
            },
        }),
    }),
});

export const { useGetMembersQuery } = membersSlice;
