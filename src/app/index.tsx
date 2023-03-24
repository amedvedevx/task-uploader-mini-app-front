import { lazy, StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { PreloadScreen } from '@/components';
import { store } from '@/api';

const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <Suspense fallback={<PreloadScreen />}>
            <Provider store={store}>
                <App />
            </Provider>
        </Suspense>
    </StrictMode>,
);
