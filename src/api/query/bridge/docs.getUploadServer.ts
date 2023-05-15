import bridge from '@vkontakte/vk-bridge';

interface BridgeDocsUploadServerArgs {
    token: string;
}

type BridgeDocsUploadServerResponce = {
    upload_url: string;
};

export const BridgeDocsUploadServer = async ({
    token,
}: BridgeDocsUploadServerArgs): Promise<BridgeDocsUploadServerResponce | 'error'> => {
    const result: BridgeDocsUploadServerResponce | 'error' = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'docs.getUploadServer',
            params: {
                access_token: token,
                v: '5.131',
            },
        })
        .then((res) => {
            if (res.response?.[0]?.error) {
                return 'error';
            }

            return res.response as BridgeDocsUploadServerResponce;
        })
        .catch((err) => 'error');

    return result;
};
