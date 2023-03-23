import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TaskResults } from '@/app/types';
import { getInitials } from '@/lib/utils';
import { useLazyDownloadFilesQuery } from '@/api';
import type { TabType } from '@/pages';

interface CollectionMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isTaskClosed: boolean;
    selectedTab: TabType;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({
    taskResults,
    collectionId,
    isTaskClosed,
    selectedTab,
}) => {
    const [downloadFiles, { isLoading, originalArgs }] = useLazyDownloadFilesQuery();
    const testees = taskResults.map((el) => el.testee);

    const onClick = ({ taskId, vkUserId }: { taskId: string; vkUserId: number }) => {
        if (selectedTab === 'completed') {
            downloadFiles({ taskId, vkUserId });
        } else {
            // eslint-disable-next-line no-console
            console.log('напомнить');
        }
    };

    return (
        <Group
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
                                {selectedTab === 'completed'
                                    ? 'Скачать'
                                    : !isTaskClosed && 'Напомнить'}
                            </Button>
                        }
                    >
                        {fullName}
                    </Members>
                ))}
            </List>
        </Group>
    );
};

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
