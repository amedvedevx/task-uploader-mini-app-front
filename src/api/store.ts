import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '@/api/query/apiSlice';
import authorizationReducer from '@/api/state/authorizationSlice';
import layoutReducer from '@/api/state/layoutSlice';

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    layout: layoutReducer,
    authorization: authorizationReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
