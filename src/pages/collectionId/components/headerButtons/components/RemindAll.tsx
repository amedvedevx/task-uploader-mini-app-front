import { Icon24NotificationOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

export const RemindAll: FC = () => {
    const remindAllFunc = () => {};

    return (
        <CellButton
            before={
                <Avatar
                    withBorder={false}
                    size={40}
                >
                    <Icon24NotificationOutline />
                </Avatar>
            }
            onClick={() => remindAllFunc()}
        >
            Напомнить всем
        </CellButton>
    );
};
