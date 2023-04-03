import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import type { FriendsType } from '@/app/types';
import { getInitials } from '@/lib';
import { deleteMember } from '@/api/state';

import { avatarStub, Header, Members } from '../MembersList';

interface SelectedMembersProps {
    collection?: FriendsType[];
}

export const SelectedMembers: FC<SelectedMembersProps> = ({ collection }) => {
    const dispatch = useDispatch();

    return (
        <Group
            mode='plain'
            separator='hide'
            padding='s'
            header={<Header mode='tertiary'>Выбранные участники</Header>}
        >
            {collection?.map(({ id, first_name, last_name, photo_100 }) => (
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
                            onClick={() => dispatch(deleteMember(id))}
                        />
                    }
                >
                    {`${first_name} ${last_name}`}
                </Members>
            ))}
        </Group>
    );
};
