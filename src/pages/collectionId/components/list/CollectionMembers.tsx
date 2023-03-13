import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TaskResults } from '@/app/types';
import { getInitials, inclinationWord } from '@/lib/utils';
import { useLazyDownloadFilesQuery } from '@/api';

import { SkeletonMembers } from './components/SkeletonMembers';

interface CollectionMembersProps {
    collection: TaskResults['testee'][];
    collectionId: string;
    isComplete: boolean;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({
    collection,
    collectionId,
    isComplete,
}) => {
    const [downloadFiles, { isLoading, originalArgs }] = useLazyDownloadFilesQuery();

    const membersCount = collection.length;

    if (!collection.length) {
        return <SkeletonMembers />;
    }

    return (
        <GroupWide
            $isComplete={isComplete}
            header={
                <HeaderList>{`Прислали ${membersCount} ${inclinationWord(membersCount, [
                    'участник',
                    'участника',
                    'участников',
                ])}`}</HeaderList>
            }
            mode='plain'
            padding='s'
        >
            <List>
                {collection.map(({ vkUserId, firstName, lastName, fullName, photo }) => (
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
                                onClick={() => downloadFiles({ taskId: collectionId, vkUserId })}
                            >
                                Скачать
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

const GroupWide = styled(Group)<{ $isComplete: boolean }>`
    padding-top: ${({ $isComplete }) => ($isComplete ? '125px' : '188px')};
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
