import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TaskResults } from '@/app/types';
import { TaskStatusTypesForTestee } from '@/app/types';
import { getInitials, inclinationWord } from '@/lib/utils';
import { useLazyDownloadFilesQuery } from '@/api';
import type { TabType } from '@/pages';

import { SkeletonMembers } from './components/SkeletonMembers';

interface CollectionMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    isTaskUnlimited?: boolean;
    selectedTab: TabType;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    isTaskUnlimited,
    selectedTab,
}) => {
    const [downloadFiles, { isLoading, originalArgs }] = useLazyDownloadFilesQuery();

    const testees = isTaskUnlimited
        ? taskResults.map((el) => el.testee)
        : filterTestees(taskResults, selectedTab).map((el) => el.testee);

    const membersCount = testees?.length;

    const onClick = ({ taskId, vkUserId }: { taskId: string; vkUserId: number }) => {
        if (selectedTab === 'completed') {
            downloadFiles({ taskId, vkUserId });
        } else {
            // eslint-disable-next-line no-console
            console.log('напомнить');
        }
    };

    if (!testees?.length) {
        return <SkeletonMembers />;
    }

    return (
        <GroupWide
            $isTaskClosed={isTaskClosed}
            header={
                <HeaderList>{`${
                    selectedTab === 'completed' ? 'Прислали' : 'Не прислали'
                } ${membersCount} ${inclinationWord(membersCount, [
                    'участник',
                    'участника',
                    'участников',
                ])}`}</HeaderList>
            }
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
                            <Button
                                appearance='accent'
                                size='s'
                                mode='secondary'
                                disabled={originalArgs?.vkUserId === vkUserId && isLoading}
                                loading={originalArgs?.vkUserId === vkUserId && isLoading}
                                onClick={() => onClick({ taskId: collectionId, vkUserId })}
                            >
                                {selectedTab === 'completed' ? 'Скачать' : 'Напомнить'}
                            </Button>
                        }
                    >
                        {fullName}
                    </Members>
                ))}
            </List>
        </GroupWide>
    );
};

const filterTestees = (taskResultsArg: TaskResults[], selectedTab: string): TaskResults[] => {
    if (selectedTab === 'completed') {
        return taskResultsArg.filter(
            (result) =>
                result.taskResultStatus === TaskStatusTypesForTestee.UPLOADED ||
                TaskStatusTypesForTestee.COMPLETED,
        );
    }

    return taskResultsArg.filter(
        (result) =>
            result.taskResultStatus !== TaskStatusTypesForTestee.UPLOADED ||
            TaskStatusTypesForTestee.COMPLETED,
    );
};

const GroupWide = styled(Group)<{ $isTaskClosed: boolean }>`
    padding-top: ${({ $isTaskClosed }) => ($isTaskClosed ? '128px' : '188px')};
`;

const HeaderList = styled.div`
    padding: 0 16px;
    margin-bottom: 16px;
    font-weight: 400;
    font-size: 14px;
    color: var(--vkui--color_text_subhead);
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
