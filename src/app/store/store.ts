import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '@/api/slice/apiSlice';

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});
