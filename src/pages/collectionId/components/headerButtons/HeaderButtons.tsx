import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import type { SnackBarText } from '@/app/types';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    changePageHandler: (arg: string) => void;
    isResults: boolean;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    changePageHandler,
    isResults,
    setPopout,
    setSnackbarText,
}) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees changePageHandler={changePageHandler} />

        {isResults && (
            <RemindAll
                setPopout={setPopout}
                setSnackbarText={setSnackbarText}
            />
        )}
    </ButtonGroup>
);
