import type {
    UploadFilesProps,
    DownloadFilesProps,
    UploadFilesResponce,
    TaskDetailResult,
    DownloadSingleFileProps,
} from '@/app/types';

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
            queryFn: (resultsData) => {
                resultsData[0].content.forEach((fileData) => {
                    BridgeDownload({ url: fileData.url, fileName: fileData.title });
                });

                return { data: 'success' as unknown as void };
            },
        }),
        uploadFiles: builder.mutation<UploadFilesResponce, UploadFilesProps>({
            queryFn: async (
                { taskId, subTaskId, files },
                _queryApi,
                _extraOptions,
                fetchWithBQ,
            ) => {
                const { userInfo } = (_queryApi.getState() as RootState).authorization;

                const result = await Promise.all(
                    files.map(async (fileToSend) => {
                        const uploadUrl = await BridgeDocsUploadServer({
                            token: userInfo.token,
                        });

                        const filesData = new FormData();

                        filesData.append('url', uploadUrl?.upload_url);
                        filesData.append('file', fileToSend);

                        const uploadResponse = await fetchWithBQ({
                            url: `/files`,
                            method: 'POST',
                            body: filesData,
                        });

                        const saveResponce = await BridgeDocsSave({
                            token: userInfo.token,
                            file: uploadResponse?.data?.file,
                        });

                        return saveResponce;
                    }),
                );

                const preparedFiles = result.map((saveResult) => saveResult?.doc);

                const saveFileLink = await fetchWithBQ({
                    url: `/files?taskId=${taskId}&subTaskId=${subTaskId}`,
                    method: 'PUT',
                    body: {
                        data: preparedFiles,
                    },
                });
                return saveFileLink;
            },
            invalidatesTags: ['TaskResult'],
        }),
    }),
});

export const {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useLazyDownloadSingleFileQuery,
    useUploadFilesMutation,
} = filesSlice;
