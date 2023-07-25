import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import type { GetAllowedForRemindIdsResponse, SnackBarText, TaskType } from '@/app/types';
import type { ErrorsState } from '@/api/state';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    changePageHandler: (arg: string) => void;
    isTestees: boolean;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
    reminds: GetAllowedForRemindIdsResponse | undefined;
    currentTask: TaskType;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    changePageHandler,
    isTestees,
    setPopout,
    setSnackbarText,
    apiMessageError,
    reminds,
    currentTask,
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
                apiMessageError={apiMessageError}
                reminds={reminds}
                currentTask={currentTask}
            />
        )}
    </ButtonGroup>
);
