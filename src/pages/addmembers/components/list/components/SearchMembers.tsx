import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, List } from '@vkontakte/vkui';

import type { GetTesteesResponse } from '@/app/types';
import { getInitials } from '@/lib';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { avatarStub, GroupWide, Members } from '../MembersList';
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
                <GroupWide
                    $top='103'
                    $bottom='45'
                    mode='plain'
                    padding='s'
                >
                    <List>
                        {chats?.length > 0 &&
                            chats?.map(({ peer, chat_settings }) => (
                                <Members
                                    key={peer.id}
                                    before={
                                        <>
                                            <Checkbox
                                                checked={Boolean(selection?.isChatActive(peer.id))}
                                                onChange={(e) => {
                                                    selection?.handleSelectMember(
                                                        e,
                                                        peer.id,
                                                        'chat',
                                                    );
                                                }}
                                            />

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
                                    subtitle={`${chat_settings.members_count} участников`}
                                    onClick={(e) => {
                                        selection?.handleSelectMember(e as any, peer.id, 'chat');
                                    }}
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
                                            <Checkbox
                                                checked={Boolean(selection?.isMemberActive(id))}
                                                onChange={(e) => {
                                                    selection?.handleSelectMember(e, id, 'user');
                                                }}
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
