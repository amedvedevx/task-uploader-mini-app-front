<<<<<<< HEAD
import type { UploadFilesProps, GetFilesProps, GetFilesResponce } from '@/app/types';
=======
import type {
    UploadFilesProps,
    GetFilesProps,
    GetFilesResponce,
    UploadFilesResponce,
} from '@/app/types';
>>>>>>> task/ME-37744-Create-collection-flow

import { apiSlice } from './apiSlice';

const filesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFiles: builder.query<GetFilesResponce, GetFilesProps>({
            query: ({ taskId, subTaskId, userId }) => ({
                url: `/files/${taskId}`,
                params: { subTaskId, userId },
            }),
        }),
<<<<<<< HEAD
        uploadFiles: builder.mutation<void, UploadFilesProps>({
=======
        uploadFiles: builder.mutation<UploadFilesResponce, UploadFilesProps>({
>>>>>>> task/ME-37744-Create-collection-flow
            query: ({ taskId, subTaskId, files }) => ({
                url: `/files?taskId=${taskId}&subTaskId=${subTaskId}`,
                method: 'PUT',
                body: files,
            }),
        }),
    }),
});

export const { useGetFilesQuery, useUploadFilesMutation } = filesSlice;
