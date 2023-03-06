import { useSelector } from 'react-redux';

import { API_BASE_URL } from '@/app/config';
import type { RootState } from '@/api';

interface UseDownloadFileResult {
    download: () => void;
}

// TODO - ME-38120 - скачать файл конкретного учатсника сбора
export const useDownloadFile = (taskId: string): UseDownloadFileResult => {
    const { value } = useSelector((state: RootState) => state.authorization);

    const download = () => {
        fetch(`${API_BASE_URL}/files/${taskId}`, {
            method: 'GET',
            headers: {
                Authorization: `${value}`,
            },
        })
            .then((response) => {
                let fileName = '';
                const disposition = response.headers.get('Content-disposition');

                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);

                    if (matches != null && matches[1]) {
                        fileName = matches[1].replace(/['"]/g, '');
                    }
                }

                return { textblob: response.blob(), fileName: decodeURI(fileName.substring(5)) };
            })

            .then(async ({ textblob, fileName }) => {
                let dwnlnk = document.createElement('a');
                dwnlnk.download = fileName;

                if (window.webkitURL != null) {
                    dwnlnk.href = window.webkitURL.createObjectURL(await textblob);
                } else {
                    dwnlnk.href = window.URL.createObjectURL(await textblob);
                }
                dwnlnk.click();
            });
    };

    return { download };
};
