import type { FC } from 'react';
import { AppRoot, Button, Div } from '@vkontakte/vkui';
import { Icon20More, Icon28ClearDataOutline } from '@vkontakte/icons';
import { useEffect } from 'react';
import styled from 'styled-components';
import bridge from '@vkontakte/vk-bridge';
import { useFirstPageCheck } from '@happysanta/router';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';
import { StubSubtitle, StubСacheSubtitle } from '@/components/Stub/components/components';
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
                            <>
                                <StubSubtitle color='var(--vkui--color_text_secondary)'>
                                    Попробуйте очистить кэш приложения
                                </StubSubtitle>

                                <Div>
                                    <StubСacheSubtitle>
                                        1. откройте
                                        <MoreIcon />
                                        Меню приложения
                                    </StubСacheSubtitle>

                                    <StubСacheSubtitle>
                                        2. выберите
                                        <ClearDataIcon
                                            width={20}
                                            height={20}
                                        />
                                        Очистить кэш
                                    </StubСacheSubtitle>
                                </Div>

                                <StubSubtitle color='var(--vkui--color_text_secondary)'>
                                    Или обновите страницу
                                </StubSubtitle>

                                <br />

                                <Button
                                    stretched
                                    type='button'
                                    onClick={resetErrorBoundary}
                                >
                                    Обновить
                                </Button>
                            </>
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

const MoreIcon = styled(Icon20More)`
    padding: 0 8px;
`;

const ClearDataIcon = styled(Icon28ClearDataOutline)`
    padding: 0 8px;
`;
