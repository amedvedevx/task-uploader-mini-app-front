import bridge from '@vkontakte/vk-bridge';

import type { GetTesteesResponse } from '@/app/types';

interface BridgeSeacrhConversationsArgs {
    token: string;
    search: string;
    count: number;
}

export const BridgeSearchConversations = async ({
    token,
    search,
    count,
}: BridgeSeacrhConversationsArgs): Promise<GetTesteesResponse> => {
    const result: GetTesteesResponse = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.searchConversations',
            params: {
                access_token: token,
                q: search,
                count,
                extended: 1,
                v: '5.189',
                fields: 'photo_100',
            },
        })
        .then((data: { response: GetTesteesResponse }) => data.response);

    return result;
};
