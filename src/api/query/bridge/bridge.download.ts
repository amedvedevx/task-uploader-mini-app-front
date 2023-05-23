/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

interface BridgeDownloadArgs {
    url: string;
    fileName: string;
}

type BridgeDownloadResponce = 'error' | 'success';

export const BridgeDownload = async ({
    url,
    fileName,
}: BridgeDownloadArgs): Promise<BridgeDownloadResponce> => {
    const result: BridgeDownloadResponce = await bridge
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
        .catch((err) => {
            console.log(err);

            return 'error';
        });

    return result;
};
