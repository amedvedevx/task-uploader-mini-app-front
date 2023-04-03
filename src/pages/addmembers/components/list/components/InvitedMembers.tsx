import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group, List } from '@vkontakte/vkui';
import { Icon24DoneOutline } from '@vkontakte/icons';

import type { TaskResults } from '@/app/types';
import { getInitials } from '@/lib';

import { avatarStub, Members } from '../MembersList';

interface InvitedMembersProps {
    collection?: TaskResults['testee'][];
}

export const InvitedMembers: FC<InvitedMembersProps> = ({ collection }) => (
    <Group
        separator='hide'
        mode='plain'
        padding='s'
    >
        <List>
            {collection?.map(({ vkUserId, firstName, lastName, fullName, photo }) => (
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
            ))}
        </List>
    </Group>
);
