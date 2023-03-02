import type {
    UploadFilesProps,
    GetFilesProps,
    GetFilesResponce,
    UploadFilesResponce,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const filesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFiles: builder.query<GetFilesResponce, GetFilesProps>({
            query: ({ taskId, subTaskId, userId }) => ({
                url: `/files/${taskId}`,
                params: { subTaskId, userId },
            }),
        }),
        uploadFiles: builder.mutation<UploadFilesResponce, UploadFilesProps>({
            query: ({ taskId, subTaskId, files }) => ({
                url: `/files?taskId=${taskId}&subTaskId=${subTaskId}`,
                method: 'PUT',
                body: files,
            }),
        }),
    }),
});

export const { useGetFilesQuery, useUploadFilesMutation } = filesSlice;
