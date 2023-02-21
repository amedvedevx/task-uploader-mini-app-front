import type { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { RouterContext } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import { useEffect, useRef, useCallback } from 'react';

import { GlobalStyles } from '@/styles';
import { AppPages } from '@/app/AppPages';
import { useCustomEventsLog, useTheme } from '@/hooks';

import { FallbackComponent } from './FallbackComponent';
import { appRouter } from './router';

bridge.send('VKWebAppInit');

const App: FC = () => {
    const { theme } = useTheme();
    const { sendActionToCustomEvent } = useCustomEventsLog();
    const firstClick = useRef<boolean>(false);

    const onDocumentClick = useCallback(() => {
        if (!firstClick.current) {
            sendActionToCustomEvent('first click', 'document');
            document.removeEventListener('click', onDocumentClick);
        }

        firstClick.current = true;
    }, [sendActionToCustomEvent]);

    useEffect(() => {
        document.addEventListener('click', onDocumentClick);

        return () => {
            document.removeEventListener('click', onDocumentClick);
        };
    }, [onDocumentClick]);

    return (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
            <RouterContext.Provider value={appRouter}>
                <ConfigProvider appearance={theme}>
                    <AdaptivityProvider>
                        <AppRoot>
                            <GlobalStyles theme={theme} />

                            <AppPages />
                        </AppRoot>
                    </AdaptivityProvider>
                </ConfigProvider>
            </RouterContext.Provider>
        </ErrorBoundary>
    );
};

export default App;
