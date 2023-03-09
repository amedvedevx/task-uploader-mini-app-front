import type {
    UploadFilesProps,
    DownloadFilesProps,
    UploadFilesResponce,
    DownloadFilesResponce,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const filesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        downloadFiles: builder.query<DownloadFilesResponce, DownloadFilesProps>({
            queryFn: async (
                { taskId, subTaskId, userId },
                _queryApi,
                _extraOptions,
                fetchWithBQ,
            ) => {
                const response = await fetchWithBQ({
                    url: `/files/${taskId}`,
                    responseHandler: (res) => res.blob(),
                    params: { subTaskId, userId },
                });

                let fileName = '';
                const disposition = response.meta?.response?.headers.get('Content-disposition');

                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);

                    if (matches != null && matches[1]) {
                        fileName = matches[1].replace(/['"]/g, '');
                    }
                }

                const result = {
                    textblob: response.data as Blob,
                    fileName: decodeURI(fileName.substring(5)),
                };

                const dwnlnk = document.createElement('a');
                dwnlnk.download = result.fileName;

                if (window.webkitURL != null) {
                    dwnlnk.href = window.webkitURL.createObjectURL(result.textblob);
                } else {
                    dwnlnk.href = window.URL.createObjectURL(result.textblob);
                }
                dwnlnk.click();
            },
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

export const { useLazyDownloadFilesQuery, useUploadFilesMutation } = filesSlice;
