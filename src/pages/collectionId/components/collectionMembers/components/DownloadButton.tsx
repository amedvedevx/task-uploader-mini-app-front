import { Button } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { DownloadFilesProps } from '@/app/types';

interface DownloadButtonProps {
    originalArgs: DownloadFilesProps | undefined;
    vkUserId: number;
    isDownloading: boolean;
    onClickHandler: (arg: {
        vkUserId: number;
        url?: string;
        title?: string;
        taskId?: string;
        subTaskId?: string;
        docId?: number;
    }) => void;
}

export const DownloadButton: FC<DownloadButtonProps> = ({
    originalArgs,
    vkUserId,
    isDownloading,
    onClickHandler,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        disabled={originalArgs?.vkUserId === vkUserId && isDownloading}
        loading={originalArgs?.vkUserId === vkUserId && isDownloading}
        onClick={() => onClickHandler({ vkUserId })}
    >
        Скачать
    </Button>
);
