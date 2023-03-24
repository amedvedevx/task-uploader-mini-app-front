import { Icon24CopyOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { copyUploadLinkToClipboard } from '@/lib/utils';

interface CopyUploadLinkProps {
    collectionId: string;
    setSnackbarText: (arg: string) => void;
}

export const CopyUploadLink: FC<CopyUploadLinkProps> = ({ collectionId, setSnackbarText }) => {
    const copyLink = (copyText: string) => {
        copyUploadLinkToClipboard(copyText);
        setSnackbarText('Ссылка скопирована');
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
