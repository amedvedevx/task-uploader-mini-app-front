import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

import { getInitials } from '@/lib';
import type { GetChatTesteesResponse } from '@/app/types';

import { avatarStub, Header, Members } from '../MembersList';

interface SelectedChatMembersProps {
    collection?: GetChatTesteesResponse[];
}

export const SelectedChatMembers: FC<SelectedChatMembersProps> = ({ collection }) => (
    <>
        {collection?.map((chat) => (
            <Group
                key={chat.chatName}
                mode='plain'
                separator='hide'
                padding='s'
                header={<Header mode='tertiary'>{chat.chatName}</Header>}
            >
                {chat.members?.map(({ id, photo_100, first_name, last_name }) => (
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
                                onClick={() => removeChatMember(id)}
                            />
                        }
                        subtitle={`Из чата «${chat.chatName}»`}
                    >
                        {`${first_name} ${last_name}`}
                    </Members>
                ))}
            </Group>
        ))}
    </>
);
