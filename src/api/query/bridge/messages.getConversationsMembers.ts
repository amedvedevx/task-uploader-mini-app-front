import bridge from '@vkontakte/vk-bridge';

import type { TesteeType } from '@/app/types';

interface BridgeGetConversationsMembersArgs {
    token: string;
    peerId: number;
    groupName: string;
    invitedMemberIds?: number[];
}

export const BridgeGetConversationsMembers = async ({
    token,
    peerId,
    groupName,
    invitedMemberIds,
}: BridgeGetConversationsMembersArgs): Promise<TesteeType> => {
    const result: TesteeType = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.getConversationMembers',
            params: {
                access_token: token,
                peer_id: peerId,
                v: ' 5.154',
            },
        })
        .then((data: { response: { profiles: TesteeType[] } }) => {
            const dataWithAddFields = data.response.profiles.map((item) => ({
                ...item,
                groupName,
                full_name: `${item.first_name} ${item.last_name}`,
            }));

            return dataWithAddFields.filter((member) => !invitedMemberIds.includes(member.id));
        })
        .catch((err) => err);

    return result;
};
