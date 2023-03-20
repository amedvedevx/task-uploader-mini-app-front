import type { FC } from 'react';
import { Avatar, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import styled from 'styled-components';

import { getInitials } from '@/lib/utils';
import type { FriendsType } from '@/app/types';

import { useMembersSelection } from '../../hooks';
import { Checkbox, SkeletonFriends } from './components';

interface CollectionMembersProps {
    collection: FriendsType[];
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({ collection }) => {
    const { handleSelectMember, isMemberActive } = useMembersSelection(
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
                {collection.map(({ id, first_name, last_name, photo_100 }) => (
                    <Members
                        key={id}
                        before={
                            <>
                                <Checkbox
                                    checked={isMemberActive(String(id))}
                                    onChange={(e) => handleSelectMember(e, String(id))}
                                />

                                <Avatar
                                    size={40}
                                    src={photo_100 === avatarStub ? '#' : photo_100}
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
