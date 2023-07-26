import type { FC } from 'react';
import { lazy, useEffect } from 'react';
import { useFirstPageCheck, useLocation } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { Root, SplitCol, SplitLayout, View } from '@vkontakte/vkui';

import { PreloadScreen } from '@/components';
import { useChangeFragment, useGenerateBearer } from '@/hooks';
import { useGetAuthTokenQuery } from '@/api';

import {
    PANEL_ADD_MEMBERS,
    PANEL_COLLECTION_HOME,
    PANEL_COLLECTION_ID,
    PANEL_CREATE_COLLECTION,
    PANEL_LIST_MEMBERS,
    PANEL_UPLOAD_ID,
    VIEW_CREATE,
    VIEW_UPLOAD,
} from './router';

const HomePage = lazy(() =>
    import('@/pages/home/HomePage').then((module) => ({ default: module.HomePage })),
);

const UploadPage = lazy(() =>
    import('@/pages/upload/UploadPage').then((module) => ({ default: module.UploadPage })),
);

const CreatePage = lazy(() =>
    import('@/pages/create/CreatePage').then((module) => ({ default: module.CreatePage })),
);

const AddMembersPage = lazy(() =>
    import('@/pages/addmembers/AddMembersPage').then((module) => ({
        default: module.AddMembersPage,
    })),
);

const ListMembersPage = lazy(() =>
    import('@/pages/listmembers/ListMembersPage').then((module) => ({
        default: module.ListMembersPage,
    })),
);

const CollectionIdPage = lazy(() =>
    import('@/pages/collectionId/CollectionIdPage').then((module) => ({
        default: module.CollectionIdPage,
    })),
);

export const AppPages: FC = () => {
    const location = useLocation();

    let isFirst = useFirstPageCheck();
    isFirst = useChangeFragment({ isFirst });

    const { data: token } = useGetAuthTokenQuery();
    const isBearerSet = useGenerateBearer(token);

    useEffect(() => {
        if (bridge.supports('VKWebAppSetSwipeSettings')) {
            bridge.send('VKWebAppSetSwipeSettings', { history: isFirst }).catch(() => {});
        }
    }, [isFirst]);

    return (
        <>
            {isBearerSet ? (
                <SplitLayout>
                    <SplitCol>
                        <Root activeView={location.getViewId()}>
                            <View
                                id={VIEW_CREATE}
                                activePanel={location.getViewActivePanel(VIEW_CREATE) as string}
                            >
                                <HomePage id={PANEL_COLLECTION_HOME} />

                                <CreatePage id={PANEL_CREATE_COLLECTION} />

                                <CollectionIdPage id={PANEL_COLLECTION_ID} />

                                <AddMembersPage id={PANEL_ADD_MEMBERS} />

                                <ListMembersPage id={PANEL_LIST_MEMBERS} />
                            </View>

                            <View
                                id={VIEW_UPLOAD}
                                activePanel={location.getViewActivePanel(VIEW_UPLOAD) as string}
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
