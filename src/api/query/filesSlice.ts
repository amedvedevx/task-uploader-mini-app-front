import type {
    UploadFileProps,
    DownloadFilesProps,
    UploadFileResponse,
    TaskDetailResult,
    DownloadSingleFileProps,
    PreUploadFilesResponse,
} from '@/app/types';
import { isForbiddenFile } from '@/lib';

import { apiSlice } from './apiSlice';
import { BridgeDocsSave, BridgeDocsUploadServer, BridgeDownload } from './bridge';
import type { RootState } from '../store';

const filesSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['TaskResult'] }).injectEndpoints({
    endpoints: (builder) => ({
        downloadFiles: builder.query<void, DownloadFilesProps>({
            queryFn: async (
                { taskId, subTaskId, vkUserId },
                _queryApi,
                _extraOptions,
                fetchWithBQ,
            ) => {
                const response = await fetchWithBQ({
                    url: `/files/${taskId}`,
                    responseHandler: (res) => res.blob(),
                    params: { subTaskId, vkUserId },
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

                // if (isForbiddenFile(result.fileName)) {
                //     return '';
                // }

                const dwnlnk = document.createElement('a');
                dwnlnk.download = result.fileName;

                if (window.webkitURL != null) {
                    dwnlnk.href = window.webkitURL.createObjectURL(result.textblob);
                } else {
                    dwnlnk.href = window.URL.createObjectURL(result.textblob);
                }

                return { data: dwnlnk.click() };
            },
        }),
        downloadSingleFile: builder.query<void, DownloadSingleFileProps>({
            queryFn: async (
                { title, taskId, subTaskId, docId, vkUserId },
                _queryApi,
                _extraOptions,
                fetchWithBQ,
            ) => {
                const response = await fetchWithBQ({
                    url: `/files/${taskId}/${subTaskId}`,
                    responseHandler: (res) => res.blob(),
                    params: { docId, vkUserId },
                });

                const result = {
                    textblob: response.data as Blob,
                    fileName: title,
                };

                const dwnlnk = document.createElement('a');
                dwnlnk.download = result.fileName;

                if (window.webkitURL != null) {
                    dwnlnk.href = window.webkitURL.createObjectURL(result.textblob);
                } else {
                    dwnlnk.href = window.URL.createObjectURL(result.textblob);
                }

                return { data: dwnlnk.click() };
            },
        }),
        downloadFilesOnMobile: builder.query<void, TaskDetailResult[]>({
            queryFn: async (resultsData) => {
                const result = await Promise.all(
                    resultsData[0].content.map(async (fileData) => {
                        const dwnlResult = await BridgeDownload({
                            url: fileData.url,
                            fileName: fileData.title,
                        });

                        return dwnlResult;
                    }),
                );

                if (result.includes('error')) {
                    return { error: 'error' };
                }

                return { data: 'success' };
            },
        }),
        uploadFile: builder.mutation<UploadFileResponse, UploadFileProps>({
            queryFn: async (
                { taskId, subTaskId, file },
                { getState },
                _extraOptions,
                fetchWithBQ,
            ) => {
                const { token } = (getState() as RootState).authorization;

                const uploadUrl = await BridgeDocsUploadServer({
                    token,
                });

                const filesData = new FormData();

                if (uploadUrl !== 'error') {
                    filesData.append('url', uploadUrl?.upload_url);
                    filesData.append('file', file);
                }

                const uploadResponse: PreUploadFilesResponse = await fetchWithBQ({
                    url: `/files`,
                    method: 'POST',
                    body: filesData,
                });

                const saveResponse = await BridgeDocsSave({
                    token,
                    file: uploadResponse?.data?.file,
                });

                if (saveResponse?.error_code) {
                    return { error: saveResponse?.error_msg };
                }

                const saveFileLinkResponse = await fetchWithBQ({
                    url: `/files?taskId=${taskId}&subTaskId=${subTaskId}`,
                    method: 'PUT',
                    body: {
                        data: [saveResponse?.doc],
                    },
                });

                return saveFileLinkResponse;
            },
            invalidatesTags: ['TaskResult'],
        }),
    }),
});

export const {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useLazyDownloadSingleFileQuery,
    useUploadFileMutation,
} = filesSlice;
