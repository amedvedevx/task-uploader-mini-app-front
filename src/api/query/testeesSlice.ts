import bridge from '@vkontakte/vk-bridge';

import type { FriendsType, GetTesteesProps } from '@/app/types';

import { apiSlice } from './apiSlice';
import type { RootState } from '../store';

const testeesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestees: builder.query<FriendsType[], GetTesteesProps>({
            queryFn: async ({ search, count }, { getState }) => {
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

                return { data: testees };
            },
        }),
    }),
});

export const { useGetTesteesQuery } = testeesSlice;
