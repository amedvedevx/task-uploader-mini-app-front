import { Icon24Add } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

export const AddTestees: FC = () => {
    const addTesteeFunc = () => {};

    return (
        <CellButton
            before={
                <Avatar
                    withBorder={false}
                    size={40}
                >
                    <Icon24Add />
                </Avatar>
            }
            onClick={() => addTesteeFunc()}
        >
            Добавить участников
        </CellButton>
    );
};
