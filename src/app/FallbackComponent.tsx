import type { FC } from 'react';
import { AppRoot, Button } from '@vkontakte/vkui';
import styled from 'styled-components';

import { Stub } from '@/components';
import { AUTH_ERROR_MESSAGE } from '@/app/constants';
import { StubAuth } from '@/components/Stub/StubAuth';

interface FallbackComponentProps {
    error: Error;
    resetErrorBoundary: (...args: unknown[]) => void;
}

export const FallbackComponent: FC<FallbackComponentProps> = ({ error, resetErrorBoundary }) => (
    <AppRoot>
        <StubWrapper>
            {error?.message === AUTH_ERROR_MESSAGE ? (
                <StubAuth />
            ) : (
                <Stub
                    title='Ошибка'
                    subtitle={error?.message || 'Что-то пошло не так'}
                    type='fallback'
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

const StubWrapper = styled.div`
    padding-top: 15vh;

    display: flex;
    justify-content: center;
`;
