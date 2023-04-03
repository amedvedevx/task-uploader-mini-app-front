import type { FC } from 'react';
import {
    Avatar,
    Group,
    List,
    SimpleCell,
    calcInitialsAvatarColor,
    Header as HeaderRoot,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useLocation } from '@happysanta/router';

import { getInitials } from '@/lib/utils';
import type { FriendsType, GetTesteesResponse, TaskResults } from '@/app/types';
import { deleteMember } from '@/api/state';
import { PANEL_ADD_MEMBERS, PANEL_LIST_MEMBERS } from '@/app/router';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { Checkbox } from './components';
import { InvitedMembers } from './components/InvitedMembers';
import { ChatMembers } from './components/ChatMembers';
import { SelectedMembers } from './components/SelectedMembers';

interface MembersListProps {
    collection?: GetTesteesResponse;
    invitedMembers?: TaskResults['testee'][];
    selectedMembers?: FriendsType[];
    selectedChatMembers?: FriendsType[][];
    selection?: UseMembersSelectionResult;
}

export const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({
    collection,
    invitedMembers,
    selectedMembers,
    selectedChatMembers,
    selection,
}) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const chats = collection?.items.filter((el) => el.peer.type === 'chat');

    return (
        <>
            {invitedMembers?.length > 0 && <InvitedMembers collection={invitedMembers} />}

            {selectedChatMembers?.length > 0 && <ChatMembers collection={selectedChatMembers} />}

            {selectedMembers?.length > 0 && <SelectedMembers collection={selectedMembers} />}

            {collection?.items.length > 0 && (
                <GroupWide
                    $top='103'
                    $bottom='45'
                    mode='plain'
                    padding='s'
                >
                    <List>
                        {chats?.length > 0 &&
                            chats.map(({ peer, chat_settings }) => (
                                <Members
                                    key={peer.id}
                                    before={
                                        <>
                                            {location.getPanelId() === PANEL_ADD_MEMBERS && (
                                                <Checkbox
                                                    checked={Boolean(
                                                        selection?.isChatActive(peer.id),
                                                    )}
                                                    onChange={(e) => {
                                                        selection?.handleSelectMember(
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
                                        selection?.handleSelectMember(e as any, peer.id, 'chat')
                                    }
                                >
                                    {chat_settings.title}
                                </Members>
                            ))}

                        {collection?.profiles &&
                            collection.profiles.map(({ id, first_name, last_name, photo_100 }) => (
                                <Members
                                    key={id}
                                    before={
                                        <>
                                            {location.getPanelId() === PANEL_ADD_MEMBERS && (
                                                <Checkbox
                                                    checked={Boolean(selection?.isMemberActive(id))}
                                                    onChange={(e) => {
                                                        selection?.handleSelectMember(
                                                            e,
                                                            id,
                                                            'user',
                                                        );
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
                                    onClick={(e) =>
                                        selection?.handleSelectMember(e as any, id, 'user')
                                    }
                                >
                                    {`${first_name} ${last_name}`}
                                </Members>
                            ))}
                    </List>
                </GroupWide>
            )}
        </>
    );
};

export const GroupWide = styled(Group)<{ $top?: string; $bottom?: string }>`
    padding-top: ${({ $top }) => ($top ? `${$top}px` : '0px')};
    padding-bottom: ${({ $bottom }) => ($bottom ? `${$bottom}px` : '0px')};
`;

export const Header = styled(HeaderRoot)`
    .vkuiHeader__main {
        color: var(--vkui--color_text_subhead);
    }
`;

export const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
