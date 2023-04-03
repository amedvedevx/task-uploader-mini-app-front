import bridge from '@vkontakte/vk-bridge';

import { UPLOAD_URL } from '@/app/config';

interface BridgeMessagesSendArgs {
    token: string;
    peers: string;
    message: string;
    taskId: string;
}

type BridgeMessagesSendResponce = 'success' | 'error';

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
        .then((result) => 'success')
        .catch((err) => 'error');

    return result;
};
