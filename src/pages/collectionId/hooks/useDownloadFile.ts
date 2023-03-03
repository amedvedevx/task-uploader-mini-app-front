import { API_BASE_URL, APP_DEV_AUTH } from '@/app/config';

interface UseDownloadFileResult {
    download: () => Promise<void>;
}

export const useDownloadFile = (taskId: string, userId?: string): UseDownloadFileResult => {
    const download = async () => {
        await fetch(`${API_BASE_URL}/files/${taskId}`, {
            method: 'GET',
            headers: {
                Authorization: `${APP_DEV_AUTH}`,
            },
        })
            .then((response) =>
                response.blob().then((data) => ({
                    data,
                    filename: response.headers.get('Content-Disposition'),
                })),
            )

            .then(({ data, filename }) => {
                let dwnlnk = document.createElement('a');
                dwnlnk.download = filename;

                if (window.webkitURL != null) {
                    dwnlnk.href = window.webkitURL.createObjectURL(data);
                } else {
                    dwnlnk.href = window.URL.createObjectURL(data);
                }
                dwnlnk.click();
            });
    };

    return { download };
};
