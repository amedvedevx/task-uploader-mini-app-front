import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import type { SnackBarText } from '@/app/types';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    changePageHandler: (arg: string) => void;
    isTestees: boolean;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    changePageHandler,
    isTestees,
    setPopout,
    setSnackbarText,
}) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees changePageHandler={changePageHandler} />

        {isTestees && (
            <RemindAll
                setPopout={setPopout}
                setSnackbarText={setSnackbarText}
            />
        )}
    </ButtonGroup>
);
