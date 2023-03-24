// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/app/config';

import type { RootState } from '../store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const bearer = (getState() as RootState).authorization.value;

            if (!endpoint.includes('uploadFiles' || 'downloadFiles')) {
                headers.set('Content-type', 'application/json');
            }

            if (bearer) {
                headers.set('Authorization', bearer);
            }

            return headers;
        },
    }),
    endpoints: () => ({}),
});
