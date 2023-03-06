import { useState } from 'react';
import copy from 'copy-to-clipboard';

import { APP_ID } from '@/app/config';

interface CopyFnResult {
    copyLink: () => boolean;
    text?: string;
    setText: (text: string) => void;
}

export const useCopyToClipboard = (collectionId: string): CopyFnResult => {
    const [text, setText] = useState<string>('');
    const link = `https://vk.com/app${APP_ID}/#/upload/${collectionId}`;

    const copyLink = () => {
        if (!navigator?.clipboard) {
            return false;
        }

        try {
            copy(link);
            setText('Ссылка скопирована');

            return true;
        } catch (error) {
            setText('');
            return false;
        }
    };

    return { copyLink, text, setText };
};
