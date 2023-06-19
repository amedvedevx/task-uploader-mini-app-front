/* eslint-disable no-console */
import bridge from '@vkontakte/vk-bridge';

interface BridgeDocsSaveArgs {
    token: string;
    file: string;
    title?: string;
}

type BridgeDocsSaveResponse = {
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
type ErrorData = {
    error_code: number;
    error_msg: string;
    request_params: Record<string, unknown>[];
};

type ErrorType = {
    error_data: ErrorData;
    error_type: string;
};

export const BridgeDocsSave = async ({
    token,
    file,
    title,
}: BridgeDocsSaveArgs): Promise<BridgeDocsSaveResponse | ErrorData> => {
    const result: BridgeDocsSaveResponse | ErrorData = await bridge
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (res.response?.[0]?.error) {
                return {
                    error_msg: res?.response?.[0]?.error as string,
                    error_code: 0,
                    request_params: [],
                };
            }

            return res.response as BridgeDocsSaveResponse;
        })
        .catch((error: ErrorType) => {
            console.error('VKWebAppCallAPIMethod-docs.save', error);

            return {
                error_msg: error.error_type,
                error_code: 0,
                request_params: [],
            };
        });

    return result;
};
