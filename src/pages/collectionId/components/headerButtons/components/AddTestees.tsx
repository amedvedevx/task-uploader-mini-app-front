import { Icon24Add } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { PAGE_ADD_MEMBERS } from '@/app/router';
import type { ErrorsState } from '@/api/state';

interface AddTesteesProps {
    changePageHandler: (arg: string) => void;
    apiMessageError: ErrorsState | undefined;
}

export const AddTestees: FC<AddTesteesProps> = ({ changePageHandler, apiMessageError }) => (
    <CellButton
        before={
            <Avatar
                withBorder={false}
                size={40}
            >
                <Icon24Add />
            </Avatar>
        }
        subtitle={apiMessageError ? apiMessageError.text : null}
        disabled={!!apiMessageError}
        onClick={() => changePageHandler(PAGE_ADD_MEMBERS)}
    >
        Добавить участников
    </CellButton>
);
