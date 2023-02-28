import type { FC } from 'react';
import { Snackbar as SnackbarRoot } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline } from '@vkontakte/icons';

interface SnackbarProps {
    onClose: () => void;
}

export const Snackbar: FC<SnackbarProps> = ({ onClose }) => (
    <SnackbarRoot
        before={
            <Icon28CheckCircleOutline
                color='var(--vkui--color_text_positive)'
                width={24}
                height={24}
            />
        }
        onClose={onClose}
    >
        Сбор создан
    </SnackbarRoot>
);
