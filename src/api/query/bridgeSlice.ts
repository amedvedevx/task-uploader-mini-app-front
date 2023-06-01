import type { EGetLaunchParamsResponsePlatforms } from '@vkontakte/vk-bridge';

import { apiSlice } from './apiSlice';
import type { VKWebAppCreateHashResult } from './bridge';
import { BridgeCreateHash, BridgeGetPlatform, BridgeGetUserId, BridgeGetAuthToken } from './bridge';
import { setError, setToken } from '../state';

const bridgeSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ['Hash', 'Platform', 'UserId', 'AuthToken'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            createHash: builder.query<VKWebAppCreateHashResult, void>({
                queryFn: async () => {
                    const result = await BridgeCreateHash();

                    if (result === 'error') {
                        return { error: 'error' };
                    }

                    return { data: result };
                },
                providesTags: ['Hash'],
            }),
            getPlatform: builder.query<EGetLaunchParamsResponsePlatforms, void>({
                queryFn: async () => {
                    const result = await BridgeGetPlatform();

                    if (result === 'error') {
                        return { error: 'error' };
                    }

                    return { data: result };
                },
                providesTags: ['Platform'],
            }),
            getUserId: builder.query<number, void>({
                queryFn: async () => {
                    const result = await BridgeGetUserId();

                    if (result === 'error') {
                        return { error: 'error' };
                    }

                    return { data: result };
                },
                providesTags: ['UserId'],
            }),
            getAuthToken: builder.query<string, void>({
                queryFn: async (args, { dispatch }) => {
                    const result = await BridgeGetAuthToken();

                    if (result === 'error') {
                        dispatch(
                            setError({
                                type: 'api-messages',
                                text: 'Данный функционал временно недоступен',
                            }),
                        );

                        return { error: 'error' };
                    }

                    dispatch(
                        setToken({
                            token: result,
                        }),
                    );

                    return { data: result };
                },
                providesTags: ['AuthToken'],
            }),
        }),
    });

export const {
    useCreateHashQuery,
    useGetPlatformQuery,
    useGetUserIdQuery,
    useLazyGetPlatformQuery,
    useGetAuthTokenQuery,
} = bridgeSlice;
