import { Icon24CopyOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { copyUploadLinkToClipboard } from '@/lib/utils';
import type { SnackBarText } from '@/app/types';

interface CopyUploadLinkProps {
    collectionId: string;
    setSnackbarText: (arg: SnackBarText) => void;
}

export const CopyUploadLink: FC<CopyUploadLinkProps> = ({ collectionId, setSnackbarText }) => {
    const copyLink = (copyText: string) => {
        copyUploadLinkToClipboard(copyText);
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
            onClick={() => copyLink(collectionId)}
        >
            Скопировать ссылку на сбор
        </CellButton>
    );
};
