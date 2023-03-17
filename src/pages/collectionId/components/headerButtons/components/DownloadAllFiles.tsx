import { Icon24DownloadOutline } from '@vkontakte/icons';
import { CellButton, Avatar, Spinner } from '@vkontakte/vkui';
import type { FC } from 'react';

import { useLazyDownloadFilesQuery } from '@/api/query';

interface DownloadAllFilesProps {
    collectionId: string;
}

export const DownloadAllFiles: FC<DownloadAllFilesProps> = ({ collectionId }) => {
    const [downloadFiles, { isFetching }] = useLazyDownloadFilesQuery();

    return (
        <CellButton
            before={
                <Avatar
                    withBorder={false}
                    size={40}
                >
                    <Icon24DownloadOutline />
                </Avatar>
            }
            after={isFetching && <Spinner />}
            disabled={isFetching}
            onClick={() => downloadFiles({ taskId: collectionId })}
        >
            Скачать все файлы
        </CellButton>
    );
};
