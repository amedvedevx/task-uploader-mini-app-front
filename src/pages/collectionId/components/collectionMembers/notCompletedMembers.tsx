import type { FC } from 'react';
import { Avatar, Button, Cell, List, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type {
    GetAllowedForRemindIdsResponse,
    SnackBarText,
    TaskResults,
    TaskType,
} from '@/app/types';
import { getInitials } from '@/lib/utils';
import { useSendNotificationMutation, useUpdateAllowedForRemindIdsMutation } from '@/api';
import type { ErrorsState } from '@/api/state';

interface NotCompletedMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
    removeMemberHandler: (fullName: string, vkUserId: number) => void;
    currentTask: TaskType;
    reminds: GetAllowedForRemindIdsResponse | undefined;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const NotCompletedMembers: FC<NotCompletedMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    setSnackbarText,
    apiMessageError,
    removeMemberHandler,
    currentTask,
    reminds,
}) => {
    const [sendNotification, { isLoading: isSendingNotification, originalArgs }] =
        useSendNotificationMutation();
    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();
    const testees = taskResults.map((el) => el.testee);

    const onClickHandler = async ({ vkUserId, fullName }: OnClickArgs) => {
        if (currentTask) {
            const result = await sendNotification({
                taskId: collectionId,
                task: currentTask,
                whoToSend: [vkUserId],
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
                    mode='removable'
                    onRemove={() => removeMemberHandler(fullName, vkUserId)}
                >
                    {fullName}
                </Member>
            ))}
        </List>
    );
};

const Member = styled(Cell)`
    margin-bottom: 16px;
`;

type OnClickArgs = {
    vkUserId: number;
    fullName: string;
};

interface RemindButtonProps {
    reminds: GetAllowedForRemindIdsResponse | undefined;
    vkUserId: number;
    onClickHandler: (arg: { vkUserId: number; fullName: string }) => void;
    fullName: string;
    apiMessageError: ErrorsState | undefined;
    loading: boolean | undefined;
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
