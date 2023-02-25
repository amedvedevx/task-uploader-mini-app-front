import type { FC } from 'react';
import { lazy, useEffect, Suspense } from 'react';
import { useFirstPageCheck, useLocation } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { Root, SplitCol, SplitLayout, View } from '@vkontakte/vkui';

import { PreloadScreen } from '@/components';
import { CreatePage } from '@/pages/create';
import { ShareLink } from '@/pages/share';
import { SentList } from '@/pages/list';

import {
    PANEL_COLLECTION_HOME,
    PANEL_CREATE_COLLECTION,
    PANEL_COLLECTION_ID,
    PANEL_COLLECTION_LIST,
    VIEW_CREATE,
} from './router';

const HomePage = lazy(() =>
    import('@/pages/home/HomePage').then((module) => ({
        default: module.HomePage,
    })),
);

export const AppPages: FC = () => {
    const location = useLocation();
    const isFirst = useFirstPageCheck();

    useEffect(() => {
        bridge.send('VKWebAppSetSwipeSettings', { history: isFirst });
    }, [isFirst]);

    return (
        <Suspense fallback={<PreloadScreen />}>
            <SplitLayout>
                <SplitCol>
                    <Root activeView={location.getViewId()}>
                        <CreatePage />

                        <View
                            id={VIEW_CREATE}
                            activePanel={location.getViewActivePanel(VIEW_CREATE)}
                        >
                            <HomePage id={PANEL_COLLECTION_HOME} />

                            <CreatePage id={PANEL_CREATE_COLLECTION} />

                            <ShareLink id={PANEL_COLLECTION_ID} />

                            <SentList id={PANEL_COLLECTION_LIST} />
                        </View>
                    </Root>
                </SplitCol>
            </SplitLayout>
        </Suspense>
    );
};
