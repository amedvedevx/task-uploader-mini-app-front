import { Icon28CheckCircleOutline, Icon28CancelCircleFillRed } from '@vkontakte/icons';
import { Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { SnackBarText } from '@/app/types';

interface UploadResultMessageProps {
    result: SnackBarText;
    setSnackbarText: (arg: SnackBarText) => void;
}

export const UploadResultMessage: FC<UploadResultMessageProps> = ({ result, setSnackbarText }) => (
    <Snackbar
        before={
            result?.type === 'success' ? (
                <Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />
            ) : (
                <Icon28CancelCircleFillRed />
            )
        }
        onClose={() => setSnackbarText(null)}
    >
        {result?.text}
    </Snackbar>
);
