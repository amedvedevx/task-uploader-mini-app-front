import type { FC } from 'react';
import {
    Avatar,
    Group,
    List,
    SimpleCell,
    calcInitialsAvatarColor,
    Header as HeaderRoot,
} from '@vkontakte/vkui';
import { Icon24Cancel, Icon24DoneOutline } from '@vkontakte/icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useLocation } from '@happysanta/router';

import { getInitials } from '@/lib/utils';
import type { FriendsType, TaskResults } from '@/app/types';
import { deleteMember } from '@/api/state';
import { PANEL_ADD_MEMBERS, PANEL_LIST_MEMBERS } from '@/app/router';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { Checkbox } from './components';

interface MembersListProps {
    collection: FriendsType[];
    invitedMembers?: TaskResults['testee'][];
    selection: UseMembersSelectionResult;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({ collection, invitedMembers, selection }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    return (
        <MembersListWrapper>
            {invitedMembers && invitedMembers?.length > 0 && (
                <Group
                    separator='hide'
                    mode='plain'
                    padding='s'
                >
                    <List>
                        {invitedMembers.map(
                            ({ vkUserId, firstName, lastName, fullName, photo }) => (
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
                                    after={<Icon24DoneOutline />}
                                >
                                    {fullName}
                                </Members>
                            ),
                        )}
                    </List>
                </Group>
            )}

            {collection.length > 0 && (
                <Group
                    mode='plain'
                    padding='s'
                    header={
                        !invitedMembers?.length && (
                            <Header
                                color='#6D7885'
                                mode='tertiary'
                            >
                                Выбранные участники
                            </Header>
                        )
                    }
                >
                    <List>
                        {collection.map(({ id, first_name, last_name, photo_100 }) => (
                            <Members
                                key={id}
                                before={
                                    <>
                                        {location.getPanelId() === PANEL_ADD_MEMBERS && (
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
                                    location.getPanelId() === PANEL_LIST_MEMBERS && (
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
                </Group>
            )}
        </MembersListWrapper>
    );
};

const MembersListWrapper = styled.div`
    padding-top: 103px;
    padding-bottom: 45px;
`;

const Header = styled(HeaderRoot)`
    .vkuiHeader__main {
        color: var(--vkui--color_text_subhead);
    }
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
