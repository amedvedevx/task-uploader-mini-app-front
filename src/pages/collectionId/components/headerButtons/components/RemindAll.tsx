import { Icon24NotificationOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useParams } from '@happysanta/router';

import { Popout } from '@/components';
import { useGetTaskIdQuery, useSendNotificationMutation } from '@/api';
import type { SnackBarText, TaskResults, TaskType } from '@/app/types';

interface RemindAllProps {
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    notCompletedMembers: TaskResults[];
}

export const RemindAll: FC<RemindAllProps> = ({
    setPopout,
    setSnackbarText,
    notCompletedMembers,
}) => {
    const { collectionId } = useParams();
    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const [sendNotification] = useSendNotificationMutation();
    const testeesIds = notCompletedMembers.map((testeeResult) => testeeResult.testee.vkUserId);

    const remindAllClick = async () => {
        const result = await sendNotification({
            taskId: collectionId,
            ownerName: currentTask?.owner.fullName,
            whoToSend: testeesIds,
            taskName: currentTask?.name,
        }).unwrap();

        if (result === 'success') {
            setSnackbarText({ type: 'success', text: 'Напоминания отправлены' });
        } else {
            setSnackbarText({ type: 'error', text: 'Произошла ошибка' });
        }
    };
    const popoutRemindAll = (
        <Popout
            text='Вы уверены, что хотите отправить уведомление всем участникам сбора?'
            header='Отправить напоминание'
            action={remindAllClick}
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
