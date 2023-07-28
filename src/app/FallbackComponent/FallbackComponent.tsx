import type { FC } from 'react';
import { useEffect } from 'react';
import { AppRoot, Button, Div, Spacing } from '@vkontakte/vkui';
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
                        <Spacing size={25} />

                        {errorHandler.onReset && (
                            <>
                                <StubSubtitle color='var(--vkui--color_text_secondary)'>
                                    Повторите загрузку или
                                </StubSubtitle>

                                <Div>
                                    <StubСacheSubtitle>
                                        1. нажмите на «<MoreIcon />»
                                    </StubСacheSubtitle>

                                    <StubСacheSubtitle>
                                        2. выберите «
                                        <ClearDataIcon
                                            width={20}
                                            height={20}
                                        />
                                        Очистить кеш »
                                    </StubСacheSubtitle>
                                </Div>

                                <Button
                                    stretched
                                    mode='tertiary'
                                    type='button'
                                    size='l'
                                    onClick={errorHandler.onReset}
                                >
                                    Повторить загрузку
                                </Button>
                            </>
                        )}
                    </Stub>
                )}
            </StubWrapper>
        </AppRoot>
    );
};
