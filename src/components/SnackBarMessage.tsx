import { Snackbar } from '@vkontakte/vkui';
import type { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';

import type { SnackBarText } from '@/app/types';

import { ErrorIcon, SuccessIcon } from './icons';

interface SnackBarMessageProps {
    snackbarText: SnackBarText;
    setSnackbarText: Dispatch<SetStateAction<SnackBarText>>;
    isFooterOnPage?: boolean;
}

export const SnackBarMessage: FC<SnackBarMessageProps> = ({
    snackbarText,
    setSnackbarText,
    isFooterOnPage,
}) => (
    <SnackbarBottomMargin
        $isFooterOnPage={isFooterOnPage}
        before={snackbarText?.type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
        onClose={() => setSnackbarText(null)}
    >
        {snackbarText?.text}
    </SnackbarBottomMargin>
);

const SnackbarBottomMargin = styled(Snackbar)<{ $isFooterOnPage?: boolean }>`
    ${({ $isFooterOnPage }) => $isFooterOnPage && `margin-bottom: 68px`};
`;
