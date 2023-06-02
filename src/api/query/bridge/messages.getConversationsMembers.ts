/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

import type { TesteeType } from '@/app/types';

interface BridgeGetConversationsMembersArgs {
    token: string;
    peerId: number;
}

export const BridgeGetConversationsMembers = async ({
    token,
    peerId,
}: BridgeGetConversationsMembersArgs): Promise<TesteeType[] | void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: TesteeType[] | void = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.getConversationMembers',
            params: {
                access_token: token,
                peer_id: peerId,
                v: ' 5.154',
            },
        })
        .then((data: { response: { profiles: TesteeType[] } }) => data.response.profiles)
        .catch((error) => {
            console.error('VKWebAppCallAPIMethod - messages.getConversationMembers', error);
        });

    return result;
};
