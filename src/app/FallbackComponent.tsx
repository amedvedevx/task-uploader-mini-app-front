import type { FC } from 'react';
import { useEffect } from 'react';
import { AppRoot, Button } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { VKBridgeEvent, ReceiveDataMap, ChangeFragmentResponse } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useFirstPageCheck, useRouter } from '@happysanta/router';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';
import { useGetPlatformQuery } from '@/api';
import { checkIsMobilePlatform } from '@/lib';

import { PAGE_UPLOAD_ID, PAGE_COLLECTION_ID, PAGE_COLLECTION_HOME } from './router';

interface FallbackComponentProps {
    error: Error;
    resetErrorBoundary: (...args: unknown[]) => void;
}

export const FallbackComponent: FC<FallbackComponentProps> = ({ error, resetErrorBoundary }) => {
    const router = useRouter();

    let isFirst = useFirstPageCheck();
    const { data: platform = '' } = useGetPlatformQuery();
    const isMobilePlatform = checkIsMobilePlatform(platform);

    const bridgeEvents = ({ detail: { type, data } }: VKBridgeEvent<keyof ReceiveDataMap>) => {
        if (type === 'VKWebAppChangeFragment') {
            const dataTyped = data as ChangeFragmentResponse;
            const index = dataTyped.location?.lastIndexOf('/');
            const id = dataTyped.location.substring(index + 1);

            if (dataTyped.location.includes('upload')) {
                router.pushPage(PAGE_UPLOAD_ID, { uploadId: id });
                isFirst = true;
            } else if (dataTyped.location.includes('collectionId')) {
                router.pushPage(PAGE_COLLECTION_ID, { collectionId: id });
            } else if (dataTyped.location === '') {
                router.pushPage(PAGE_COLLECTION_HOME);
            }
            resetErrorBoundary();
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
        <AppRoot>
            <StubWrapper>
                {error?.message === AUTH_ERROR_MESSAGE ? (
                    <StubAuth />
                ) : (
                    <Stub
                        title='Ошибка'
                        subtitle={error?.message || 'Что-то пошло не так'}
                    >
                        <br />

                        {resetErrorBoundary && (
                            <Button
                                stretched
                                type='button'
                                onClick={resetErrorBoundary}
                            >
                                Попробовать еще раз
                            </Button>
                        )}
                    </Stub>
                )}
            </StubWrapper>
        </AppRoot>
    );
};

const StubWrapper = styled.div`
    padding-top: 15vh;

    display: flex;
    justify-content: center;
`;
