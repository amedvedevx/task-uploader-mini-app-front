import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import type { FriendsType } from '@/app/types';
import { getInitials } from '@/lib';
import { deleteChatMember } from '@/api/state';

import { avatarStub, GroupWide, Header, Members } from '../MembersList';

interface SelectedChatMembersProps {
    collection?: { chatName: string; members: FriendsType[] }[];
}

export const SelectedChatMembers: FC<SelectedChatMembersProps> = ({ collection }) => {
    const dispatch = useDispatch();

    return (
        <>
            {collection?.map((chat) => (
                <GroupWide
                    key={chat.chatName}
                    $bottom='45'
                    mode='plain'
                    separator='hide'
                    padding='s'
                    header={<Header mode='tertiary'>{chat.chatName}</Header>}
                >
                    {chat.members.map(({ id, photo_100, first_name, last_name }) => (
                        <Members
                            key={id}
                            before={
                                <Avatar
                                    size={40}
                                    src={photo_100 === avatarStub ? '#' : photo_100}
                                    alt='icon'
                                    gradientColor={calcInitialsAvatarColor(id)}
                                    initials={getInitials(`${first_name} ${last_name}`)}
                                />
                            }
                            after={
                                <Icon24Cancel
                                    fill='var(--vkui--color_text_tertiary)'
                                    onClick={() => dispatch(deleteChatMember(id))}
                                />
                            }
                            subtitle={`Из чата «${chat.chatName}»`}
                        >
                            {`${first_name} ${last_name}`}
                        </Members>
                    ))}
                </GroupWide>
            ))}
        </>
    );
};
