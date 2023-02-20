import { useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';

import { APP_ID } from '@/app/config';

import { useVkUserId } from './useVkUserId';

export interface VKWebAppCreateHashResult {
    sign: string;
    ts: string;
}

export const useVkHash = (): string | undefined => {
    const [vkHash, setVkHash] = useState<VKWebAppCreateHashResult | undefined>();
    const vkUserId = useVkUserId();

    const fetchVkHash = useCallback(async () => {
        const result = await bridge
            .send('VKWebAppCreateHash')
            // eslint-disable-next-line no-console
            .catch((error) => console.error('VKWebAppCreateHash', error));

        if (result) {
            setVkHash(result as unknown as VKWebAppCreateHashResult);
        }
    }, []);

    useEffect(() => {
        void fetchVkHash();
    }, [fetchVkHash]);

    if (!vkHash || !vkUserId) {
        return undefined;
    }

    return `Bearer {"sign": ${JSON.stringify(
        vkHash.sign,
    )}, "userId": ${vkUserId.toString()}, "appId": ${APP_ID}, "ts": ${vkHash.ts}}`;
};
