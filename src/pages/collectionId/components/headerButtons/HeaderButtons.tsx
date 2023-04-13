import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import type { SnackBarText } from '@/app/types';
import type { ErrorsState } from '@/api/state';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    changePageHandler: (arg: string) => void;
    isTestees: boolean;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    changePageHandler,
    isTestees,
    setPopout,
    setSnackbarText,
    apiMessageError,
}) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees
            changePageHandler={changePageHandler}
            apiMessageError={apiMessageError}
        />

        {isTestees && (
            <RemindAll
                setPopout={setPopout}
                setSnackbarText={setSnackbarText}
            />
        )}
    </ButtonGroup>
);
