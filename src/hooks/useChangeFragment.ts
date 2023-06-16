import type { VKBridgeEvent, ReceiveDataMap } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useEffect } from 'react';
import type { ChangeFragmentResponse } from '@vkontakte/vk-bridge/dist/types/src/types/data';
import { useRouter } from '@happysanta/router';

import { PAGE_UPLOAD_ID, PAGE_COLLECTION_ID, PAGE_COLLECTION_HOME } from '@/app/router';

interface UseThemeProps {
    isFirst: boolean;
    resetErrorBoundary?: () => void;
}

export const useChangeFragment = ({ isFirst, resetErrorBoundary }: UseThemeProps): boolean => {
    const router = useRouter();
    let isFirstPage = isFirst;
    const changeFragment = ({ detail: { type, data } }: VKBridgeEvent<keyof ReceiveDataMap>) => {
        if (type === 'VKWebAppChangeFragment') {
            const dataTyped = data as ChangeFragmentResponse;
            const index = dataTyped.location?.lastIndexOf('/');
            const id = dataTyped.location.substring(index + 1);

            if (dataTyped.location.includes('upload')) {
                router.pushPage(PAGE_UPLOAD_ID, { uploadId: id });
                isFirstPage = true;
            } else if (dataTyped.location.includes('collectionId')) {
                router.pushPage(PAGE_COLLECTION_ID, { collectionId: id });
            } else if (dataTyped.location === '') {
                router.pushPage(PAGE_COLLECTION_HOME);
            }

            if (resetErrorBoundary) resetErrorBoundary();
        }
    };

    useEffect(() => {
        bridge.send('VKWebAppGetConfig');
        bridge.subscribe(changeFragment);

        return () => {
            bridge.unsubscribe(changeFragment);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isFirstPage;
};
