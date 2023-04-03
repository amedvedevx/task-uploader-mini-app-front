import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import type { FriendsType } from '@/app/types';
import { getInitials } from '@/lib';
import { deleteChatMember } from '@/api/state';

import { avatarStub, GroupWide, Header, Members } from '../MembersList';

interface ChatMembersProps {
    collection?: FriendsType[][];
}

export const ChatMembers: FC<ChatMembersProps> = ({ collection }) => {
    const dispatch = useDispatch();

    return (
        <>
            {collection?.map((chatMembers) => (
                <GroupWide
                    mode='plain'
                    separator='hide'
                    padding='s'
                    header={<Header mode='tertiary'>Чат</Header>}
                >
                    {chatMembers.map(({ id, photo_100, first_name, last_name }) => (
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
                            subtitle='Из чата «Чат»'
                        >
                            {`${first_name} ${last_name}`}
                        </Members>
                    ))}
                </GroupWide>
            ))}
        </>
    );
};
