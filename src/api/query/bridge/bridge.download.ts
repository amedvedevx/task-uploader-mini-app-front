/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

interface BridgeDownloadArgs {
    url: string;
    fileName: string;
}

type BridgeDownloadResponse = 'error' | 'success';

export const BridgeDownload = async ({
    url,
    fileName,
}: BridgeDownloadArgs): Promise<BridgeDownloadResponse> => {
    const result: BridgeDownloadResponse = await bridge
        .send('VKWebAppDownloadFile', {
            url,
            filename: fileName,
        })
        .then((res) => {
            if (res.result) {
                return 'success';
            }

            return 'error';
        })
        .catch((error) => {
            console.error('VKWebAppDownloadFile', error);

            return 'error';
        });

    return result;
};
