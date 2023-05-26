import type { FC } from 'react';
import { Avatar, Button, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { GetAllowedForRemindIdsResponce, SnackBarText, TaskResults } from '@/app/types';
import { getInitials } from '@/lib/utils';
import {
    useGetAllowedForRemindIdsQuery,
    useGetTaskIdQuery,
    useSendNotificationMutation,
    useUpdateAllowedForRemindIdsMutation,
} from '@/api';
import type { ErrorsState } from '@/api/state';

interface NotCompletedMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const NotCompletedMembers: FC<NotCompletedMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    setSnackbarText,
    apiMessageError,
}) => {
    const { data: currentTask } = useGetTaskIdQuery({ taskId: collectionId });
    const [sendNotification, { isLoading: isSendingNotification, originalArgs }] =
        useSendNotificationMutation();

    const { data: reminds } = useGetAllowedForRemindIdsQuery({ taskId: collectionId });
    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();
    const testees = taskResults.map((el) => el.testee);

    const onClickHandler = async ({ vkUserId, fullName }: OnClickArgs) => {
        if (currentTask) {
            const result = await sendNotification({
                taskId: collectionId,
                ownerName: currentTask?.owner.fullName,
                whoToSend: [vkUserId],
                taskName: currentTask?.name,
            }).unwrap();

            if (result === 'success') {
                setSnackbarText({ type: 'success', text: `Отправили напоминание для ${fullName}` });
                updateReminds({ taskId: collectionId, userIds: [vkUserId] });
            } else {
                setSnackbarText({
                    type: 'error',
                    text: `Произошла ошибка при попытке отправить напоминание для ${fullName}`,
                });
            }
        }
    };

    return (
        <List data-automation-id='collectionId-page-membersList'>
            {testees.map(({ vkUserId, firstName, lastName, fullName, photo }) => (
                <Member
                    key={vkUserId}
                    before={
                        <Avatar
                            size={40}
                            src={photo === avatarStub ? '#' : photo}
                            alt='icon'
                            gradientColor={calcInitialsAvatarColor(vkUserId)}
                            initials={getInitials(`${firstName} ${lastName}`)}
                        />
                    }
                    after={
                        !isTaskClosed && (
                            <RemindButton
                                reminds={reminds}
                                vkUserId={vkUserId}
                                isSendingNotification={isSendingNotification}
                                loading={
                                    isSendingNotification &&
                                    originalArgs?.whoToSend?.includes(vkUserId)
                                }
                                fullName={fullName}
                                apiMessageError={apiMessageError}
                                onClickHandler={onClickHandler}
                            />
                        )
                    }
                >
                    {fullName}
                </Member>
            ))}
        </List>
    );
};

const Member = styled(SimpleCell)`
    margin-bottom: 16px;
`;

type OnClickArgs = {
    vkUserId: number;
    fullName: string;
};

interface RemindButtonProps {
    reminds: GetAllowedForRemindIdsResponce | undefined;
    vkUserId: number;
    onClickHandler: (arg: { vkUserId: number; fullName: string }) => void;
    fullName: string;
    apiMessageError: ErrorsState | undefined;
    loading: boolean;
}

const RemindButton: FC<RemindButtonProps> = ({
    reminds,
    vkUserId,
    onClickHandler,
    fullName,
    apiMessageError,
    loading,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        disabled={!reminds?.allowedUserIds.includes(vkUserId) || !!apiMessageError}
        loading={loading}
        onClick={() => onClickHandler({ vkUserId, fullName })}
    >
        Напомнить
    </Button>
);
