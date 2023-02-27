import { Div, ButtonGroup, Button } from '@vkontakte/vkui';
import type { FC } from 'react';

interface UploadPageActionsProps {
    clearState: () => void;
    sendFiles: () => void;
}

export const UploadPageActions: FC<UploadPageActionsProps> = ({ clearState, sendFiles }) => (
    <Div>
        <ButtonGroup
            stretched
            mode='horizontal'
            gap='m'
        >
            <Button
                stretched
                size='l'
                mode='secondary'
                appearance='accent'
                onClick={() => clearState()}
            >
                Отменить
            </Button>

            <Button
                stretched
                size='l'
                appearance='accent'
                mode='primary'
                onClick={() => sendFiles()}
            >
                Отправить
            </Button>
        </ButtonGroup>
    </Div>
);
