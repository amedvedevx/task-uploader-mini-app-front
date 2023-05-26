import bridge from '@vkontakte/vk-bridge';

import { UPLOAD_URL } from '@/app/config';

interface BridgeMessagesSendArgs {
    token: string;
    peers: string;
    message: string;
    taskId: string;
}

type ErrorResponce = {
    response: [
        {
            peer_id: number;
            message_id: number;
            error: { code: number; description: string };
        },
        { peer_id: number; message_id: number; conversation_message_id: number },
    ];
};

type Error = {
    error: string;
    forbiddenUsers: number[];
};

export type BridgeMessagesSendResponce = 'success' | Error;

export const BridgeMessagesSend = async ({
    token,
    peers,
    message,
    taskId,
}: BridgeMessagesSendArgs): Promise<BridgeMessagesSendResponce> => {
    const result: BridgeMessagesSendResponce = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'messages.send',
            params: {
                access_token: token,
                random_id: Date.now(),
                peer_ids: peers,
                message,
                attachment: `[{
                    "type": "link",
                    "link": {
                        "url": ${UPLOAD_URL}${taskId},
                        "title": ${UPLOAD_URL}${taskId},
                        "caption": "vk.com",
                        "description": "",
                        "is_favorite": false
                    }
                }]`,

                v: '5.131',
            },
        })
        .then((res: ErrorResponce) => {
            if (res.response[0].error) {
                const forbiddenUsers = res.response.slice(1).map((user) => user.peer_id);
                const errorData = {
                    error: res.response[0].error.description,
                    forbiddenUsers,
                };

                return errorData;
            }

            return 'success';
        })
        .catch((err) => 'error');

    return result;
};
