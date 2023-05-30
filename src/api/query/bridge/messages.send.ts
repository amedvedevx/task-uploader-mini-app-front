import bridge from '@vkontakte/vk-bridge';

import { UPLOAD_URL } from '@/app/config';

interface BridgeMessagesSendArgs {
    token: string;
    peers: string;
    message: string;
    taskId: string;
}
type ErrorCantSend = {
    peer_id: number;
    message_id: number;
    error: { code: number; description: string };
};
type ErrorSuccessSend = {
    peer_id: number;
    message_id: number;
    conversation_message_id: number;
};

type ErrorResponce = {
    response: ErrorCantSend[] & ErrorSuccessSend;
};

type Error = {
    error: string;
    successUsers: number[];
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

                v: '5.189',
            },
        })
        .then((res: ErrorResponce) => {
            if (res.response[0].error) {
                const successUsers = res.response
                    .filter((user) => !user.error)
                    .map((user) => user.peer_id);
                const errorData = {
                    error: res.response[0].error.description,
                    successUsers,
                };

                return errorData;
            }

            return 'success';
        })
        .catch((err) => 'error');

    return result;
};
