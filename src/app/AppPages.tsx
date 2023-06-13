import type { FC } from 'react';
import { lazy, useEffect, useRef } from 'react';
import { useFirstPageCheck, useLocation, useRouter } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';
import type { ChangeFragmentResponse, ReceiveDataMap, VKBridgeEvent } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { Root, SplitCol, SplitLayout, View } from '@vkontakte/vkui';

import { PreloadScreen } from '@/components';
import { checkIsMobilePlatform } from '@/lib';
import { useGenerateBearer } from '@/hooks';
import { useGetAuthTokenQuery, useGetPlatformQuery } from '@/api';

import {
    PAGE_COLLECTION_ID,
    PAGE_UPLOAD_ID,
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
    const router = useRouter();
    let isFirst = useFirstPageCheck();
    const { data: platform = '' } = useGetPlatformQuery();
    useGetAuthTokenQuery();
    const isMobilePlatform = checkIsMobilePlatform(platform);
    const bearer = useGenerateBearer();
    const canRedirectToMain = useRef<boolean>(true);

    const bridgeEvents = ({ detail: { type, data } }: VKBridgeEvent<keyof ReceiveDataMap>) => {
        if (type === 'VKWebAppChangeFragment') {
            canRedirectToMain.current = false;
            const dataTyped = data as ChangeFragmentResponse;
            const index = dataTyped.location?.lastIndexOf('/');
            const id = dataTyped.location.substring(index + 1);

            if (dataTyped.location.includes('upload')) {
                router.pushPage(PAGE_UPLOAD_ID, { uploadId: id });
                isFirst = true;
            } else if (dataTyped.location.includes('collectionId')) {
                router.pushPage(PAGE_COLLECTION_ID, { collectionId: id });
            }
        }

        if (type === 'VKWebAppViewRestore') {
            if (canRedirectToMain.current) {
                router.pushPage('/');
            }

            canRedirectToMain.current = true;
        }
    };

    useEffect(() => {
        bridge.subscribe(bridgeEvents);

        return () => {
            bridge.unsubscribe(bridgeEvents);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMobilePlatform) {
            bridge.send('VKWebAppSetSwipeSettings', { history: isFirst }).catch(() => {});
        }
    }, [isFirst, isMobilePlatform]);

    return (
        <>
            {bearer ? (
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
