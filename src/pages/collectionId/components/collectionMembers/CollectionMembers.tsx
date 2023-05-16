import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type {
    DownloadFilesProps,
    GetAllowedForRemindIdsResponce,
    SnackBarText,
    TaskResults,
} from '@/app/types';
import { getInitials } from '@/lib/utils';
import {
    useGetAllowedForRemindIdsQuery,
    useGetTaskIdQuery,
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useSendNotificationMutation,
    useUpdateAllowedForRemindIdsMutation,
} from '@/api';
import type { TabType } from '@/pages/collectionId/CollectionIdPage';
import type { ErrorsState } from '@/api/state';

interface CollectionMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    selectedTab: TabType;
    setSnackbarText: (arg: SnackBarText) => void;
    apiMessageError: ErrorsState | undefined;
    isMobilePlatform: boolean;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    selectedTab,
    setSnackbarText,
    apiMessageError,
    isMobilePlatform,
}) => {
    const [downloadFiles, { isLoading: isDownloading, originalArgs }] = useLazyDownloadFilesQuery();
    const [downloadFilesOnMobile] = useLazyDownloadFilesOnMobileQuery();
    const { data: currentTask } = useGetTaskIdQuery({ taskId: collectionId });
    const [sendNotification, { isLoading: isSendingNotification }] = useSendNotificationMutation();

    const { data: reminds } = useGetAllowedForRemindIdsQuery({ taskId: collectionId });
    const [updateReminds] = useUpdateAllowedForRemindIdsMutation();
    const testees = taskResults.map((el) => el.testee);

    const onClickHandler = async ({ vkUserId, fullName }: OnClickArgs) => {
        if (selectedTab === 'completed') {
            if (isMobilePlatform) {
                const resultsForUser = taskResults.find(
                    (taskResult) => taskResult.testee.vkUserId === vkUserId,
                );

                if (resultsForUser) {
                    downloadFilesOnMobile(resultsForUser?.subTaskResults);
                }
            }
            downloadFiles({ taskId: collectionId, vkUserId });
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
        <Group
            mode='plain'
            padding='s'
        >
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
                            selectedTab === 'completed' ? (
                                <DownloadButton
                                    originalArgs={originalArgs}
                                    vkUserId={vkUserId}
                                    isDownloading={isDownloading}
                                    fullName={fullName}
                                    onClickHandler={onClickHandler}
                                />
                            ) : (
                                <>
                                    {!isTaskClosed && (
                                        <RemindButton
                                            reminds={reminds}
                                            vkUserId={vkUserId}
                                            isSendingNotification={isSendingNotification}
                                            fullName={fullName}
                                            apiMessageError={apiMessageError}
                                            onClickHandler={onClickHandler}
                                        />
                                    )}
                                </>
                            )
                        }
                    >
                        {fullName}
                    </Member>
                ))}
            </List>
        </Group>
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
    isSendingNotification: boolean;
    onClickHandler: (arg: { vkUserId: number; fullName: string }) => void;
    fullName: string;
    apiMessageError: ErrorsState | undefined;
}

const RemindButton: FC<RemindButtonProps> = ({
    reminds,
    vkUserId,
    isSendingNotification,
    onClickHandler,
    fullName,
    apiMessageError,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        disabled={!reminds?.allowedUserIds.includes(vkUserId) || !!apiMessageError}
        loading={isSendingNotification}
        onClick={() => onClickHandler({ vkUserId, fullName })}
    >
        Напомнить
    </Button>
);

interface DownloadButtonProps {
    originalArgs: DownloadFilesProps | undefined;
    vkUserId: number;
    isDownloading: boolean;
    onClickHandler: (arg: { vkUserId: number; fullName: string }) => void;
    fullName: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({
    originalArgs,
    vkUserId,
    isDownloading,
    onClickHandler,
    fullName,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        disabled={originalArgs?.vkUserId === vkUserId && isDownloading}
        loading={originalArgs?.vkUserId === vkUserId && isDownloading}
        onClick={() => onClickHandler({ vkUserId, fullName })}
    >
        Скачать
    </Button>
);
