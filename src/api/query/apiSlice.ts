// Import the RTK Query methods from the React-specific entry point
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/app/config';

import type { RootState } from '../store';

export interface ResponseError {
    status: 'PARSING_ERROR' | 'CUSTOM_ERROR';
    originalStatus: number;
    data: { message: string; detail?: string };
    error: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        const { bearer } = (getState() as RootState).authorization;

        if (!endpoint.includes('uploadFile' || 'downloadFiles')) {
            headers.set('Content-type', 'application/json');
        }

        if (bearer) {
            headers.set('Authorization', bearer);
        }

        return headers;
    },
});

const typedBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    ResponseError | FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    return result;
};
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: typedBaseQuery,
    endpoints: () => ({}),
});
