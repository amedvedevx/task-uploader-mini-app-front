import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import type { SnackBarText, TaskResults } from '@/app/types';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    collectionId: string;
    isResults: boolean;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    notCompletedMembers: TaskResults[];
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    collectionId,
    isResults,
    setPopout,
    setSnackbarText,
    notCompletedMembers,
}) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees collectionId={collectionId} />

        {isResults && (
            <RemindAll
                notCompletedMembers={notCompletedMembers}
                setPopout={setPopout}
                setSnackbarText={setSnackbarText}
            />
        )}
    </ButtonGroup>
);
