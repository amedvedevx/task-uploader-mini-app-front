import { Snackbar } from '@vkontakte/vkui';
import type { Dispatch, FC, SetStateAction } from 'react';

import type { SnackBarText } from '@/app/types';

import { ErrorIcon, SuccessIcon } from './icons';

interface SnackBarMessageProps {
    snackbarText: SnackBarText;
    setSnackbarText: Dispatch<SetStateAction<SnackBarText>>;
}

export const SnackBarMessage: FC<SnackBarMessageProps> = ({ snackbarText, setSnackbarText }) => (
    <Snackbar
        before={snackbarText?.type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
        onClose={() => setSnackbarText(null)}
    >
        {snackbarText?.text}
    </Snackbar>
);
