import type { FC } from 'react';
import { useEffect, Suspense } from 'react';
import { useLocation, useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';

import { useApi } from '@/api/base/hooks';
import { PreloadScreen } from '@/components';
import { useCustomEventsLog } from '@/hooks';
import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';

export const AppPages: FC = () => {
    const location = useLocation();
    const router = useRouter();
    const isFirst = location.state.length === 1;
    const { diaryUser } = useApi();
    const { sendActionToCustomEvent } = useCustomEventsLog();

    const changePage = (e: string) => {
        router.pushPage(e);

        sendActionToCustomEvent('open tab', e);
    };

    useEffect(() => {
        bridge.send('VKWebAppSetSwipeSettings', { history: isFirst });
    }, [isFirst]);

    return (
        <>
            {!diaryUser ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <PanelHeaderCentered>Test Uploader</PanelHeaderCentered>
                </Suspense>
            ) : (
                <PreloadScreen />
            )}
        </>
    );
};
