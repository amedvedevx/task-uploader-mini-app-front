import { Div, ButtonGroup, Button } from '@vkontakte/vkui';
import type { FC } from 'react';

interface UploadPageActionsProps {
    clearState: () => void;
    sendFiles: () => void;
    isLoading: boolean;
}

export const UploadPageActions: FC<UploadPageActionsProps> = ({
    clearState,
    sendFiles,
    isLoading,
}) => (
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
                disabled={isLoading}
                data-automation-id='upload-page-cancelButton'
                onClick={() => clearState()}
            >
                Отменить
            </Button>

            <Button
                stretched
                size='l'
                appearance='accent'
                mode='primary'
                disabled={isLoading}
                data-automation-id='upload-page-sendFilesButton'
                onClick={() => sendFiles()}
            >
                Отправить
            </Button>
        </ButtonGroup>
    </Div>
);
