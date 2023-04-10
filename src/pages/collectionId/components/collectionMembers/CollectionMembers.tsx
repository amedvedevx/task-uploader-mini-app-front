import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { SnackBarText, TaskResults } from '@/app/types';
import { getInitials } from '@/lib/utils';
import {
    useGetAllowedForRemindIdsQuery,
    useGetTaskIdQuery,
    useLazyDownloadFilesQuery,
    useSendNotificationMutation,
    useUpdateAllowedForRemindIdsMutation,
} from '@/api';
import type { TabType } from '@/pages/collectionId/CollectionIdPage';

interface CollectionMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    selectedTab: TabType;
    setSnackbarText: (arg: SnackBarText) => void;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    selectedTab,
    setSnackbarText,
}) => {
    const [downloadFiles, { isLoading, originalArgs }] = useLazyDownloadFilesQuery();
    const { data: currentTask } = useGetTaskIdQuery({ taskId: collectionId });
    const [sendNotification] = useSendNotificationMutation();

    const { data: reminds } = useGetAllowedForRemindIdsQuery({ taskId: collectionId });
    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();
    const testees = taskResults.map((el) => el.testee);

    const onClickHandler = async ({ taskId, vkUserId, fullName }: OnClickArgs) => {
        if (selectedTab === 'completed') {
            downloadFiles({ taskId, vkUserId });
        } else if (currentTask) {
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
        <GroupWide
            $selectedTab={selectedTab}
            $isTaskClosed={isTaskClosed}
            mode='plain'
            padding='s'
        >
            <List>
                {testees.map(({ vkUserId, firstName, lastName, fullName, photo }) => (
                    <Members
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
                            selectedTab === 'notCompleted' && isTaskClosed ? null : (
                                <Button
                                    appearance='accent'
                                    size='s'
                                    mode='secondary'
                                    disabled={
                                        (originalArgs?.vkUserId === vkUserId && isLoading) ||
                                        !reminds?.allowedUserIds.includes(vkUserId)
                                    }
                                    loading={originalArgs?.vkUserId === vkUserId && isLoading}
                                    onClick={() =>
                                        onClickHandler({ taskId: collectionId, vkUserId, fullName })
                                    }
                                >
                                    {selectedTab === 'completed' ? 'Скачать' : 'Напомнить'}
                                </Button>
                            )
                        }
                    >
                        {fullName}
                    </Members>
                ))}
            </List>
        </GroupWide>
    );
};

const GroupWide = styled(Group)<{ $selectedTab: TabType; $isTaskClosed: boolean }>`
    ${({ $selectedTab, $isTaskClosed }) =>
        $selectedTab === 'notCompleted' && !$isTaskClosed
            ? 'padding-top: 155px'
            : 'padding-top: 55px'};
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;

type OnClickArgs = {
    taskId: string;
    vkUserId: number;
    fullName: string;
};
