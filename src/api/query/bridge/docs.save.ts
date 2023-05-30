/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

interface BridgeDocsSaveArgs {
    token: string;
    file: string;
    title?: string;
}

type BridgeDocsSaveResponce = {
    type: string;
    doc: {
        id: number;
        owner_id: number;
        title: string;
        size: number;
        ext: string;
        date: number;
        type: number;
        url: string;
    };
};

export const BridgeDocsSave = async ({
    token,
    file,
    title,
}: BridgeDocsSaveArgs): Promise<BridgeDocsSaveResponce | 'error'> => {
    const result: BridgeDocsSaveResponce | 'error' = await bridge
        .send('VKWebAppCallAPIMethod', {
            method: 'docs.save',
            params: {
                access_token: token,
                file,
                title: title || '',
                v: '5.189',
            },
        })
        .then((res) => {
            if (res.response?.[0]?.error) {
                return 'error';
            }

            return res.response as BridgeDocsSaveResponce;
        })
        .catch((error) => {
            console.error('VKWebAppCallAPIMethod-docs.save', error);

            return 'error';
        });

    return result;
};
