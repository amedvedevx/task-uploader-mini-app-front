import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group, List } from '@vkontakte/vkui';

import type { GetTesteesResponse } from '@/app/types';
import { getInitials } from '@/lib';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { avatarStub, Members } from '../MembersList';
import { Checkbox } from './Checkbox';

interface SearchMembersProps {
    collection?: GetTesteesResponse;
    selection?: UseMembersSelectionResult;
}

export const SearchMembers: FC<SearchMembersProps> = ({ collection, selection }) => {
    const chats = collection?.items.filter((el) => el.peer.type === 'chat');

    return (
        <>
            {collection?.items.length > 0 && (
                <Group
                    mode='plain'
                    padding='s'
                >
                    <List>
                        {chats?.length > 0 &&
                            chats?.map((chat) => (
                                <Members
                                    key={chat.peer.id}
                                    before={
                                        <>
                                            <Checkbox
                                                checked={Boolean(selection?.isChatActive(chat))}
                                                onChange={(e) => {
                                                    selection?.handleSelectChat(e, chat);
                                                }}
                                            />

                                            <Avatar
                                                size={40}
                                                src={
                                                    !chat.chat_settings.photo
                                                        ? avatarStub
                                                        : chat.chat_settings.photo.photo_100
                                                }
                                                alt='icon'
                                                gradientColor={calcInitialsAvatarColor(
                                                    chat.peer.id,
                                                )}
                                            />
                                        </>
                                    }
                                    subtitle={`${chat.chat_settings.members_count} участников`}
                                    onClick={(e) => {
                                        selection?.handleSelectChat(e as any, chat);
                                    }}
                                >
                                    {chat.chat_settings.title}
                                </Members>
                            ))}

                        {collection?.profiles &&
                            collection.profiles.map((member) => (
                                <Members
                                    key={member.id}
                                    before={
                                        <>
                                            <Checkbox
                                                checked={Boolean(selection?.isMemberActive(member))}
                                                onChange={(e) => {
                                                    selection?.handleSelectMember(e, member);
                                                }}
                                            />

                                            <Avatar
                                                size={40}
                                                src={
                                                    member.photo_100 === avatarStub
                                                        ? '#'
                                                        : member.photo_100
                                                }
                                                alt='icon'
                                                gradientColor={calcInitialsAvatarColor(member.id)}
                                                initials={getInitials(
                                                    `${member.first_name} ${member.last_name}`,
                                                )}
                                            />
                                        </>
                                    }
                                    onClick={(e) => selection?.handleSelectMember(e as any, member)}
                                >
                                    {`${member.first_name} ${member.last_name}`}
                                </Members>
                            ))}
                    </List>
                </Group>
            )}
        </>
    );
};
