import bridge from '@vkontakte/vk-bridge';

import type { GetTesteesResponse } from '@/app/types';

export const searchConversations = (token: string, search: string, count: number) =>
    bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.searchConversations',
            params: {
                access_token: token,
                q: search,
                count,
                extended: 1,
                v: '5.131',
                fields: 'photo_100',
            },
        })
        .then((data: { response: GetTesteesResponse }) => data.response);
