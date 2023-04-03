import bridge from '@vkontakte/vk-bridge';

import type { FriendsType } from '@/app/types';

export const getConversationsMembers = (token: string, peerId: number, chatName: string) =>
    bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.getConversationMembers',
            params: {
                access_token: token,
                peer_id: peerId,
                v: ' 5.154',
            },
        })
        .then((data: { response: { profile: FriendsType[] } }) => ({
            chatName,
            members: data.response.profiles,
        }))
        .catch((err) => err);
