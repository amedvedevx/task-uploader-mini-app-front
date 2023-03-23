import type { FC } from 'react';
import { ButtonGroup } from '@vkontakte/vkui';

import { AddTestees, RemindAll } from './components';

interface HeaderButtonsProps {
    collectionId: string;
    isResults: boolean;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({ collectionId, isResults }) => (
    <ButtonGroup
        stretched
        mode='vertical'
        gap='s'
    >
        <AddTestees collectionId={collectionId} />

        {isResults && <RemindAll />}
    </ButtonGroup>
);
