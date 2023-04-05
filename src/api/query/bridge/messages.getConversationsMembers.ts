import bridge from '@vkontakte/vk-bridge';

import type { FriendsType, GetChatTesteesResponse } from '@/app/types';

interface BridgeGetConversationsMembersArgs {
    token: string;
    peerId: number;
    chatName: string;
    invitedMembersIds: number[];
}

export const BridgeGetConversationsMembers = async ({
    token,
    peerId,
    chatName,
    invitedMembersIds,
}: BridgeGetConversationsMembersArgs): Promise<GetChatTesteesResponse> => {
    const result: GetChatTesteesResponse = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.getConversationMembers',
            params: {
                access_token: token,
                peer_id: peerId,
                v: ' 5.154',
            },
        })
        .then((data: { response: { profiles: FriendsType[] } }) => ({
            chatName,
            members: data.response.profiles.filter(
                (member) => !invitedMembersIds.includes(member.id),
            ),
        }))
        .catch((err) => err);

    return result;
};
