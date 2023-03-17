import type { FC } from 'react';
import { Avatar, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import { getInitials } from '@/lib/utils';
import type { FriendsType } from '@/api';

import { useFriendsSelection } from '../../hooks';
import { Checkbox, SkeletonFriends } from './components';

interface CollectionFriendsProps {
    collection: FriendsType[];
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionFriends: FC<CollectionFriendsProps> = ({ collection }) => {
    const { isRowActive, handleSelectRow } = useFriendsSelection(
        [],
        collection.map((el): string => String(el.id)),
    );

    if (!collection.length) {
        return <SkeletonFriends />;
    }

    return (
        <GroupWide
            $isComplete
            mode='plain'
            padding='s'
        >
            <List>
                {collection.map(({ id, first_name, last_name, photo_50 }) => (
                    <Members
                        key={id}
                        before={
                            <>
                                <Checkbox
                                    checked={isRowActive(String(id))}
                                    onChange={(e) => handleSelectRow(e, String(id))}
                                />

                                <Avatar
                                    size={40}
                                    src={photo_50 === avatarStub ? '#' : photo_50}
                                    alt='icon'
                                    gradientColor={calcInitialsAvatarColor(id)}
                                    initials={getInitials(`${first_name} ${last_name}`)}
                                />
                            </>
                        }
                    >
                        {`${first_name} ${last_name}`}
                    </Members>
                ))}
            </List>
        </GroupWide>
    );
};

const GroupWide = styled(Group)<{ $isComplete: boolean }>`
    padding-top: ${({ $isComplete }) => ($isComplete ? '103px' : '188px')};
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
