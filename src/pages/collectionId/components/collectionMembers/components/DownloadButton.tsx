import { Button, Counter } from '@vkontakte/vkui';
import type { FC } from 'react';
import { Icon24Download } from '@vkontakte/icons';

import type { DownloadFilesProps, TaskDetailResultContent } from '@/app/types';

interface DownloadButtonProps {
    originalArgs: DownloadFilesProps | undefined;
    vkUserId: number;
    isDownloading: boolean;
    counter: number;
    files: TaskDetailResultContent[];
    handleDownloadFile: (
        arg: {
            vkUserId: number;
            url?: string;
            title?: string;
            taskId?: string;
            docId?: number;
        },
        files: TaskDetailResultContent[],
    ) => void;
}

export const DownloadButton: FC<DownloadButtonProps> = ({
    originalArgs,
    vkUserId,
    isDownloading,
    counter,
    handleDownloadFile,
    files,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode={originalArgs?.vkUserId === vkUserId && isDownloading ? 'tertiary' : 'secondary'}
        align='left'
        after={<Counter size='s'>{counter}</Counter>}
        disabled={originalArgs?.vkUserId === vkUserId && isDownloading}
        loading={originalArgs?.vkUserId === vkUserId && isDownloading}
        onClick={() => handleDownloadFile({ vkUserId }, files)}
    >
        <Icon24Download />
    </Button>
);
