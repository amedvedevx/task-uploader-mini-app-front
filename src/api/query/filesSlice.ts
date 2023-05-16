import type {
    UploadFilesProps,
    DownloadFilesProps,
    UploadFilesResponce,
    TaskDetailResult,
} from '@/app/types';

import { apiSlice } from './apiSlice';
import { BridgeDocsSave, BridgeDocsUploadServer, BridgeDownload } from './bridge';
import type { RootState } from '../store';

const filesSlice = apiSlice.injectEndpoints({
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
        downloadFilesOnMobile: builder.query<void, TaskDetailResult[]>({
            queryFn: (resultsData) => {
                resultsData[0].content.forEach((fileData) => {
                    BridgeDownload({ url: fileData.url, fileName: fileData.title });
                });
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

                const saveFileLink: 'success' | 'error' = await fetchWithBQ({
                    url: `/files?taskId=${taskId}&subTaskId=${subTaskId}`,
                    method: 'PUT',
                    body: {
                        data: preparedFiles,
                    },
                });

                return saveFileLink;
            },
        }),
    }),
});

export const {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useUploadFilesMutation,
} = filesSlice;
