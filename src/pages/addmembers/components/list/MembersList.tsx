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
import type { GetTesteesResponse, TaskResults } from '@/app/types';
import { deleteMember } from '@/api/state';
import { PANEL_ADD_MEMBERS, PANEL_LIST_MEMBERS } from '@/app/router';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { Checkbox, SkeletonTestees } from './components';

interface MembersListProps {
    collection: GetTesteesResponse;
    invitedMembers?: TaskResults['testee'][];
    selection: UseMembersSelectionResult;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({ collection, invitedMembers, selection }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    if (!collection.items.length) {
        return <SkeletonTestees />;
    }

    const chats = collection.items.filter((el) => el.peer.type === 'chat');

    return (
        <>
            {invitedMembers?.length > 0 && (
                <GroupWide
                    $isComplete
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
                </GroupWide>
            )}

            <GroupWide
                $isComplete={!invitedMembers?.length}
                mode='plain'
                padding='s'
                header={
                    invitedMembers?.length && (
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
                    {chats.length > 0 &&
                        chats.map(({ peer, chat_settings }) => (
                            <Members
                                key={peer.id}
                                before={
                                    <>
                                        {location.getPanelId() === PANEL_ADD_MEMBERS && (
                                            <Checkbox
                                                checked={selection.isMemberActive(peer.id)}
                                                onChange={(e) => {
                                                    selection.handleSelectMember(
                                                        e,
                                                        peer.id,
                                                        'chat',
                                                    );
                                                }}
                                            />
                                        )}

                                        <Avatar
                                            size={40}
                                            src={
                                                !chat_settings.photo
                                                    ? avatarStub
                                                    : chat_settings.photo.photo_100
                                            }
                                            alt='icon'
                                            gradientColor={calcInitialsAvatarColor(peer.id)}
                                        />
                                    </>
                                }
                                after={
                                    location.getPanelId() === PANEL_LIST_MEMBERS && (
                                        <Icon24Cancel
                                            fill='var(--vkui--color_text_tertiary)'
                                            onClick={() => dispatch(deleteMember(peer.id))}
                                        />
                                    )
                                }
                                subtitle={`${chat_settings.members_count} участников`}
                                onClick={(e) =>
                                    selection.handleSelectMember(e as any, peer.id, 'chat')
                                }
                            >
                                {chat_settings.title}
                            </Members>
                        ))}

                    {collection.profiles &&
                        collection.profiles.map(({ id, first_name, last_name, photo_100 }) => (
                            <Members
                                key={id}
                                before={
                                    <>
                                        {location.getPanelId() === PANEL_ADD_MEMBERS && (
                                            <Checkbox
                                                checked={selection.isMemberActive(id)}
                                                onChange={(e) => {
                                                    selection.handleSelectMember(e, id, 'user');
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
                                onClick={(e) => selection.handleSelectMember(e as any, id, 'user')}
                            >
                                {`${first_name} ${last_name}`}
                            </Members>
                        ))}
                </List>
            </GroupWide>
        </>
    );
};

const GroupWide = styled(Group)<{ $isComplete: boolean }>`
    padding-top: ${({ $isComplete }) => ($isComplete ? '103px' : '0')};
    padding-bottom: ${({ $isComplete }) => ($isComplete ? '45px' : '0')};
`;

const Header = styled(HeaderRoot)`
    .vkuiHeader__main {
        color: var(--vkui--color_text_subhead);
    }
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
