import type { FC } from 'react';
import { lazy, useEffect } from 'react';
import { useFirstPageCheck, useLocation } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { Root, SplitCol, SplitLayout, View } from '@vkontakte/vkui';

import { PreloadScreen } from '@/components';
import { useVkHash } from '@/api';

import {
    PANEL_COLLECTION_HOME,
    PANEL_COLLECTION_ID,
    PANEL_CREATE_COLLECTION,
    PANEL_UPLOAD_ID,
    VIEW_CREATE,
    VIEW_UPLOAD,
} from './router';

const HomePage = lazy(() =>
    import('@/pages/home/HomePage').then((module) => ({
        default: module.HomePage,
    })),
);

const UploadPage = lazy(() =>
    import('@/pages/upload/UploadPage').then((module) => ({
        default: module.UploadPage,
    })),
);

const CreatePage = lazy(() =>
    import('@/pages/create/CreatePage').then((module) => ({
        default: module.CreatePage,
    })),
);

const CollectionIdPage = lazy(() =>
    import('@/pages/collectionId/CollectionIdPage').then((module) => ({
        default: module.CollectionIdPage,
    })),
);

export const AppPages: FC = () => {
    const location = useLocation();
    const isFirst = useFirstPageCheck();

    const bearer = useVkHash();

    useEffect(() => {
        bridge.send('VKWebAppSetSwipeSettings', { history: isFirst });
    }, [isFirst]);

    return (
        <>
            {bearer ? (
                <SplitLayout>
                    <SplitCol>
                        <Root activeView={location.getViewId()}>
                            <View
                                id={VIEW_CREATE}
                                activePanel={location.getViewActivePanel(VIEW_CREATE)}
                            >
                                <HomePage id={PANEL_COLLECTION_HOME} />

                                <CreatePage id={PANEL_CREATE_COLLECTION} />

                                <CollectionIdPage id={PANEL_COLLECTION_ID} />
                            </View>

                            <View
                                id={VIEW_UPLOAD}
                                activePanel={location.getViewActivePanel(VIEW_UPLOAD)}
                            >
                                <UploadPage id={PANEL_UPLOAD_ID} />
                            </View>
                        </Root>
                    </SplitCol>
                </SplitLayout>
            ) : (
                <PreloadScreen />
            )}
        </>
    );
};
