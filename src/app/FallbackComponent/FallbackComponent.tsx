import type { FC } from 'react';
import { AppRoot, Button } from '@vkontakte/vkui';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';

import { createErrorHandler } from './utils';
import { StubWrapper } from './styled';

interface FallbackComponentProps {
    error: Error;
    resetErrorBoundary: (...args: unknown[]) => void;
}

export const FallbackComponent: FC<FallbackComponentProps> = ({ error, resetErrorBoundary }) => {
    const errorHandler = createErrorHandler(error, resetErrorBoundary);

    return (
        <AppRoot>
            <StubWrapper>
                {error?.message === AUTH_ERROR_MESSAGE ? (
                    <StubAuth />
                ) : (
                    <Stub
                        title='Ошибка'
                        subtitle={errorHandler.message}
                    >
                        <br />

                        {errorHandler.onReset && (
                            <Button
                                stretched
                                type='button'
                                onClick={errorHandler.onReset}
                            >
                                {errorHandler.resetMessage}
                            </Button>
                        )}
                    </Stub>
                )}
            </StubWrapper>
        </AppRoot>
    );
};
