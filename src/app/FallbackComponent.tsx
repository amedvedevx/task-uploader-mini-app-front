import type { FC } from 'react';
import { useEffect } from 'react';
import { AppRoot, Button } from '@vkontakte/vkui';
import styled from 'styled-components';
import bridge from '@vkontakte/vk-bridge';
import { useFirstPageCheck } from '@happysanta/router';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';
import { useGetPlatformQuery } from '@/api';
import { checkIsMobilePlatform } from '@/lib';
import { useChangeFragment } from '@/hooks';

interface FallbackComponentProps {
    error: Error;
    resetErrorBoundary: (...args: unknown[]) => void;
}

export const FallbackComponent: FC<FallbackComponentProps> = ({ error, resetErrorBoundary }) => {
    let isFirst = useFirstPageCheck();
    isFirst = useChangeFragment({ isFirst, resetErrorBoundary });
    const { data: platform = '' } = useGetPlatformQuery();
    const isMobilePlatform = checkIsMobilePlatform(platform);

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
