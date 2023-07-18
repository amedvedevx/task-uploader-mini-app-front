import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Cell } from '@vkontakte/vkui';
import styled from 'styled-components';

import { avatarStub } from '@/pages/addmembers/components';
import { getInitials } from '@/lib';
import type { TesteeType } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';

interface ProfilesProps {
    member: TesteeType;
    selection?: UseMembersSelectionResult;
}

export const Profiles: FC<ProfilesProps> = (props) => {
    const { member, selection } = props;

    return (
        <Wrapper
            key={member.id}
            mode='selectable'
            checked={Boolean(selection?.isMemberActive(member))}
            before={
                <Avatar
                    size={40}
                    src={member.photo_100 === avatarStub ? '#' : member.photo_100}
                    alt='icon'
                    gradientColor={calcInitialsAvatarColor(member.id)}
                    initials={getInitials(`${member.first_name} ${member.last_name}`)}
                />
            }
            onChange={(e) => {
                selection?.handleSelectMember(e, member);
            }}
            onClick={(e) => selection?.handleSelectMember(e, member)}
        >
            {`${member.first_name} ${member.last_name}`}
        </Wrapper>
    );
};

export const Wrapper = styled(Cell)`
    margin-bottom: 16px;
`;
