import bridge from '@vkontakte/vk-bridge';

import type { GetTesteesResponse } from '@/app/types';

interface BridgeSeacrhConversationsArgs {
    token: string;
    userId: number | null;
    search: string;
    count: number;
    invitedMemberIds?: number[];
}

export const BridgeSearchConversations = async ({
    token,
    userId,
    search,
    count,
    invitedMemberIds,
}: BridgeSeacrhConversationsArgs): Promise<GetTesteesResponse> => {
    const result: GetTesteesResponse = await bridge
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
        .then((data: { response: GetTesteesResponse }) => {
            let filteredTestees = {} as GetTesteesResponse;

            filteredTestees = {
                count: data.response.count,
                items: data.response.items.filter(
                    (el) => el.peer.type === 'chat' && !!el.chat_settings.members_count,
                ),
                profiles: data.response.profiles
                    ? data.response.profiles.filter(
                          (el) => !invitedMemberIds?.includes(el.id) && el.id !== userId,
                      )
                    : [],
            };

            return filteredTestees;
        });

    return result;
};
