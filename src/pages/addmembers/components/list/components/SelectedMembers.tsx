import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

import type { TesteeType } from '@/app/types';
import { getInitials } from '@/lib';

import { avatarStub, Members } from '../MembersList';

interface SelectedMembersProps {
    collection?: TesteeType[];
    deleteMember?: (id: number) => void;
}

export const SelectedMembers: FC<SelectedMembersProps> = ({ collection, deleteMember }) => (
    <Group
        mode='plain'
        separator='hide'
        padding='s'
    >
        {collection?.map(({ id, first_name, last_name, photo_100, chatName }) => (
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
                        onClick={() => deleteMember(id)}
                    />
                }
                subtitle={chatName.length ? `Из чата «${chatName}»` : ''}
            >
                {`${first_name} ${last_name}`}
            </Members>
        ))}
    </Group>
);
