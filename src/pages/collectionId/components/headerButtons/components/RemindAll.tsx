import { Icon24NotificationOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useLocation } from '@happysanta/router';

import { Popout } from '@/components';
import { useSendNotificationMutation, useUpdateAllowedForRemindIdsMutation } from '@/api';
import type { GetAllowedForRemindIdsResponse, SnackBarText, TaskType } from '@/app/types';
import type { ErrorsState } from '@/api/state';

interface RemindAllProps {
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
    reminds: GetAllowedForRemindIdsResponse | undefined;
    currentTask: TaskType;
}

export const RemindAll: FC<RemindAllProps> = ({
    setPopout,
    setSnackbarText,
    apiMessageError,
    reminds,
    currentTask,
}) => {
    const {
        route: {
            params: { collectionId },
        },
    } = useLocation();
    const [sendNotification] = useSendNotificationMutation();

    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();

    const remindAllClick = async () => {
        const allowedIds = reminds?.allowedUserIds;
        const result = await sendNotification({
            taskId: collectionId,
            task: currentTask,
            whoToSend: allowedIds || [],
        }).unwrap();

        if (result === 'success') {
            setSnackbarText({ type: 'success', text: 'Напоминания отправлены' });
            updateReminds({ taskId: collectionId, userIds: allowedIds });
        } else {
            setSnackbarText({
                type: 'error',
                text: 'Не удалось отправить уведомления некоторым пользователям, данные обновлены',
            });
            updateReminds({ taskId: collectionId, userIds: result.successUsers });
        }
    };
    const popoutRemindAll = (
        <Popout
            text={`От Вашего имени всем участникам сбора будет отправлено личное сообщение. \n \r
             Вы уверены, что хотите отправить уведомление?`}
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
            data-automation-id='collectionId-page-remindAll-button'
            subtitle={apiMessageError ? apiMessageError.text : null}
            disabled={
                !!apiMessageError ||
                reminds?.allowedUserIds?.length > 50 ||
                reminds?.allowedUserIds.length === 0
            }
            onClick={() => setPopout(popoutRemindAll)}
        >
            Напомнить всем
        </CellButton>
    );
};
