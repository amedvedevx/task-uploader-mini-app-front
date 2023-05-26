import { Icon24NotificationOutline } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useParams } from '@happysanta/router';

import { Popout } from '@/components';
import {
    useGetAllowedForRemindIdsQuery,
    useGetTaskIdQuery,
    useSendNotificationMutation,
    useUpdateAllowedForRemindIdsMutation,
} from '@/api';
import type { SnackBarText, TaskType } from '@/app/types';
import type { ErrorsState } from '@/api/state';

interface RemindAllProps {
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
    notificationTesteeIds: number[];
}

export const RemindAll: FC<RemindAllProps> = ({
    setPopout,
    setSnackbarText,
    apiMessageError,
    notificationTesteeIds,
}) => {
    const { collectionId } = useParams();
    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const [sendNotification] = useSendNotificationMutation();

    const { data: reminds } = useGetAllowedForRemindIdsQuery({
        taskId: collectionId,
        userIds: notificationTesteeIds,
    });

    console.log(reminds);

    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();

    const remindAllClick = async () => {
        const allowedIds = reminds?.allowedUserIds;
        const result = await sendNotification({
            taskId: collectionId,
            ownerName: currentTask?.owner.fullName,
            whoToSend: allowedIds || [],
            taskName: currentTask?.name,
        }).unwrap();

        if (result === 'success') {
            setSnackbarText({ type: 'success', text: 'Напоминания отправлены' });
            updateReminds({ taskId: collectionId, userIds: allowedIds });
        } else {
            setSnackbarText({ type: 'error', text: 'Произошла ошибка' });
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
            disabled={!!apiMessageError || reminds?.allowedUserIds?.length > 50}
            onClick={() => setPopout(popoutRemindAll)}
        >
            Напомнить всем
        </CellButton>
    );
};
