import { Icon24NotificationOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { Popout } from '@/components';

interface RemindAllProps {
    setPopout: (arg: JSX.Element | null) => void;
}

export const RemindAll: FC<RemindAllProps> = ({ setPopout }) => {
    const popoutRemindAll = (
        <Popout
            text='Вы уверены, что хотите отправить уведомление всем участникам сбора?'
            header='Отправить напоминание'
            action={() => {
                // eslint-disable-next-line no-console
                console.log('remind all');
            }}
            actionText='Напомнить всем'
            setPopout={setPopout}
        />
    );

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
            onClick={() => setPopout(popoutRemindAll)}
        >
            Напомнить всем
        </CellButton>
    );
};
