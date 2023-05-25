import { Button, Counter } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { DownloadFilesProps } from '@/app/types';

interface DownloadButtonProps {
    originalArgs: DownloadFilesProps | undefined;
    vkUserId: number;
    isDownloading: boolean;
    counter: number;
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
    counter,
    onClickHandler,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        after={<Counter size='s'>{counter}</Counter>}
        disabled={originalArgs?.vkUserId === vkUserId && isDownloading}
        loading={originalArgs?.vkUserId === vkUserId && isDownloading}
        onClick={() => onClickHandler({ vkUserId })}
    >
        Скачать все
    </Button>
);
