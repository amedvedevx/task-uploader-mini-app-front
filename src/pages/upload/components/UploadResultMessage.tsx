import { Icon28CheckCircleOutline, Icon28CancelCircleFillRed } from '@vkontakte/icons';
import { Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { SnackBarType } from '../UploadPage';

interface UploadResultMessageProps {
    result: SnackBarType;
    setSnackbar: React.Dispatch<React.SetStateAction<SnackBarType>>;
}

export const UploadResultMessage: FC<UploadResultMessageProps> = ({ result, setSnackbar }) => (
    <Snackbar
        before={
            result.type === 'success' ? (
                <Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />
            ) : (
                <Icon28CancelCircleFillRed />
            )
        }
        onClose={() => setSnackbar({ type: false, message: '' })}
    >
        {result.message}
    </Snackbar>
);
