import type { FC } from 'react';
import { useEffect } from 'react';
import { AppRoot, Button, Div } from '@vkontakte/vkui';
import { useFirstPageCheck } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';
import { useChangeFragment } from '@/hooks';
import { StubSubtitle, StubСacheSubtitle } from '@/components/Stub/components/components';
import { createErrorHandler } from '@/lib/utils';

import { ClearDataIcon, MoreIcon, StubWrapper } from './styled';

interface FallbackComponentProps {
    error: Error;
    resetErrorBoundary: (...args: unknown[]) => void;
}

export const FallbackComponent: FC<FallbackComponentProps> = ({ error, resetErrorBoundary }) => {
    const errorHandler = createErrorHandler(error, resetErrorBoundary);
    let isFirst = useFirstPageCheck();
    isFirst = useChangeFragment({ isFirst, resetErrorBoundary });

    useEffect(() => {
        if (bridge.supports('VKWebAppSetSwipeSettings')) {
            bridge.send('VKWebAppSetSwipeSettings', { history: isFirst }).catch(() => {});
        }
    }, [isFirst]);

    return (
        <AppRoot>
            <StubWrapper>
                {error?.message === AUTH_ERROR_MESSAGE ? (
                    <StubAuth />
                ) : (
                    <Stub
                        title='Ошибка'
                        subtitle={errorHandler.message || 'Что-то пошло не так'}
                    >
                        <br />

                        {errorHandler.onReset && (
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
                                    onClick={errorHandler.onReset}
                                >
                                    {errorHandler.resetMessage}
                                </Button>
                            </>
                        )}
                    </Stub>
                )}
            </StubWrapper>
        </AppRoot>
    );
};
