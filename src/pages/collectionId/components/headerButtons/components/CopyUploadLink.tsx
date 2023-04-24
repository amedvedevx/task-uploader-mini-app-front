import { Icon24CopyOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { copyUploadLinkToClipboard } from '@/lib/utils';
import type { SnackBarText, TaskType } from '@/app/types';

interface CopyUploadLinkProps {
    currentTask: TaskType;
    setSnackbarText: (arg: SnackBarText) => void;
}

export const CopyUploadLink: FC<CopyUploadLinkProps> = ({ setSnackbarText, currentTask }) => {
    const copyLink = (task: TaskType) => {
        copyUploadLinkToClipboard(task);
        setSnackbarText({ type: 'success', text: 'Ссылка скопирована' });
    };

    return (
        <CellButton
            before={
                <Avatar
                    withBorder={false}
                    size={40}
                >
                    <Icon24CopyOutline />
                </Avatar>
            }
            data-automation-id='collectionId-page-copyLink'
            onClick={() => copyLink(currentTask)}
        >
            Скопировать ссылку на сбор
        </CellButton>
    );
};
