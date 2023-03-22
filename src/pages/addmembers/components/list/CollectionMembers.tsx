import type { FC } from 'react';
import { Avatar, Group, List, SimpleCell, calcInitialsAvatarColor } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useLocation } from '@happysanta/router';

import { getInitials } from '@/lib/utils';
import type { FriendsType } from '@/app/types';
import { deleteMember } from '@/api/state';
import { PANEL_ADD_MEMBERS_ID, PANEL_LIST_MEMBERS_ID } from '@/app/router';

import type { UseMembersSelectionResult } from '../../hooks';
import { Checkbox, SkeletonFriends } from './components';

interface CollectionMembersProps {
    collection: FriendsType[];
    selection: UseMembersSelectionResult;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CollectionMembers: FC<CollectionMembersProps> = ({ collection, selection }) => {
    const location = useLocation();
    const dispatch = useDispatch();

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
                                {location.getPanelId() === PANEL_ADD_MEMBERS_ID && (
                                    <Checkbox
                                        checked={selection.isMemberActive(id)}
                                        onChange={(e) => {
                                            selection.handleSelectMember(e, id);
                                        }}
                                    />
                                )}

                                <Avatar
                                    size={40}
                                    src={photo_100 === avatarStub ? '#' : photo_100}
                                    alt='icon'
                                    gradientColor={calcInitialsAvatarColor(id)}
                                    initials={getInitials(`${first_name} ${last_name}`)}
                                />
                            </>
                        }
                        after={
                            location.getPanelId() === PANEL_LIST_MEMBERS_ID && (
                                <Icon24Cancel
                                    fill='var(--vkui--color_text_tertiary)'
                                    onClick={() => dispatch(deleteMember(id))}
                                />
                            )
                        }
                        onClick={(e) => selection.handleSelectMember(e as any, id)}
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
