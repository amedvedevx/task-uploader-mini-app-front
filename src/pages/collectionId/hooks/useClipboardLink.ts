import { useState } from 'react';

import { APP_ID } from '@/app/config';

interface CopyFnResult {
    copy: () => Promise<boolean>;
    text?: string;
}

export const useCopyToClipboard = (collectionId: string): CopyFnResult => {
    const [text, setText] = useState<string>();
    const link = `https://vk.com/${APP_ID}/upload/${collectionId}`;

    const copy = async () => {
        if (!navigator?.clipboard) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(link);
            setText('Ссылка скопирована');

            return true;
        } catch (error) {
            return false;
        }
    };

    return { copy, text };
};
