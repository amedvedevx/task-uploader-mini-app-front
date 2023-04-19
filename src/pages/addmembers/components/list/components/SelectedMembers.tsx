import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Group } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import uniq from 'lodash.uniq';

import type { TesteeType } from '@/app/types';
import { getInitials } from '@/lib';

import { avatarStub, Header, Members } from '../MembersList';

interface SelectedMembersProps {
    collection?: TesteeType[];
    deleteMember?: (id: number) => void;
}

export const SelectedMembers: FC<SelectedMembersProps> = ({ collection, deleteMember }) => {
    const groupHeaders = uniq(collection?.map((el) => el.groupName));

    return (
        <>
            {groupHeaders.map((groupHeader) => (
                <Group
                    key={groupHeader}
                    mode='plain'
                    separator='hide'
                    padding='s'
                    header={<Header mode='tertiary'>{groupHeader}</Header>}
                >
                    {collection
                        ?.filter((testee) => testee.groupName === groupHeader)
                        ?.map(({ id, first_name, last_name, full_name, photo_100, groupName }) => (
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
                                        onClick={() => deleteMember && deleteMember(id)}
                                    />
                                }
                                subtitle={
                                    groupName.length && groupName !== 'Выбранные участники'
                                        ? `Из чата «${groupName}»`
                                        : ''
                                }
                            >
                                {full_name}
                            </Members>
                        ))}
                </Group>
            ))}
        </>
    );
};
