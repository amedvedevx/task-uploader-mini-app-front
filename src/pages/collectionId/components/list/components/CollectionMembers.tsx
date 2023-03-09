import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TaskResults } from '@/app/types';
import { useDownloadFile } from '@/pages/collectionId/hooks';
import { getInitials } from '@/lib/utils';

import { SkeletonMembers } from './SkeletonMembers';

interface CollectionMembersProps {
    collection: TaskResults['testee'][];
    collectionId: string;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({ collection, collectionId }) => {
    const { download } = useDownloadFile(collectionId);

    const membersCount = collection?.length;

    if (!collection.length) {
        return <SkeletonMembers />;
    }

    return (
        <GroupWide
            header={<HeaderList>{`Прислали ${membersCount} участника`}</HeaderList>}
            mode='plain'
        >
            <List>
                {collection.map(({ id, firstName, lastName, photo }) => (
                    <Members
                        key={id}
                        before={
                            <Avatar
                                size={40}
                                src={photo === avatarStub ? '#' : photo}
                                alt='icon'
                                gradientColor={calcInitialsAvatarColor(id)}
                                initials={getInitials(`${firstName} ${lastName}`)}
                            />
                        }
                        after={
                            <Button
                                appearance='accent'
                                size='s'
                                mode='secondary'
                                onClick={() => {
                                    download(String(id));
                                }}
                            >
                                Скачать
                            </Button>
                        }
                    >
                        {`${firstName} ${lastName}`}
                    </Members>
                ))}
            </List>
        </GroupWide>
    );
};

const GroupWide = styled(Group)`
    padding-top: 180px;

    .vkuiGroup__inner {
        padding: 0 !important;
    }
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
