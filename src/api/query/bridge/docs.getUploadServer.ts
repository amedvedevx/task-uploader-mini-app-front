/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

interface BridgeDocsUploadServerArgs {
    token: string;
}

type BridgeDocsUploadServerResponse = {
    upload_url: string;
};

export const BridgeDocsUploadServer = async ({
    token,
}: BridgeDocsUploadServerArgs): Promise<BridgeDocsUploadServerResponse | 'error'> => {
    const result: BridgeDocsUploadServerResponse | 'error' = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'docs.getUploadServer',
            params: {
                access_token: token,
                v: '5.189',
            },
        })
        .then((res) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (res.response?.[0]?.error) {
                return 'error';
            }

            return res.response as BridgeDocsUploadServerResponse;
        })
        .catch((error) => {
            console.error('VKWebAppCallAPIMethod-docs.getUploadServer', error);

            return 'error';
        });

    return result;
};
