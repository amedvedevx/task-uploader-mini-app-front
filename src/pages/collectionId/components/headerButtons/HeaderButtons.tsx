import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    collectionId: string;
    isResults: boolean;
    setPopout: (arg: JSX.Element | null) => void;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({ collectionId, isResults, setPopout }) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees collectionId={collectionId} />

        {isResults && <RemindAll setPopout={setPopout} />}
    </ButtonGroup>
);
