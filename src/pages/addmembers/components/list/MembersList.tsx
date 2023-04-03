import type { FC } from 'react';
import { Group, SimpleCell, Header as HeaderRoot } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { FriendsType, GetTesteesResponse, TaskResults } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { InvitedMembers, SearchMembers, SelectedChatMembers, SelectedMembers } from './components';

interface MembersListProps {
    searchMembers?: GetTesteesResponse;
    invitedMembers?: TaskResults['testee'][];
    selectedMembers?: FriendsType[];
    selectedChatMembers?: { chatName: string; members: FriendsType[] }[];
    selection?: UseMembersSelectionResult;
}

export const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({
    searchMembers,
    invitedMembers,
    selectedChatMembers,
    selectedMembers,
    selection,
}) => (
    <>
        {invitedMembers?.length > 0 && <InvitedMembers collection={invitedMembers} />}

        {searchMembers?.items.length > 0 && (
            <SearchMembers
                collection={searchMembers}
                selection={selection}
            />
        )}
        {selectedMembers?.length > 0 && <SelectedMembers collection={selectedMembers} />}

        {selectedChatMembers?.length > 0 && (
            <SelectedChatMembers collection={selectedChatMembers} />
        )}
    </>
);

export const GroupWide = styled(Group)<{ $top?: string; $bottom?: string }>`
    padding-top: ${({ $top }) => ($top ? `${$top}px` : '0px')};
    padding-bottom: ${({ $bottom }) => ($bottom ? `${$bottom}px` : '0px')};
`;

export const Header = styled(HeaderRoot)`
    .vkuiHeader__main {
        color: var(--vkui--color_text_subhead);
    }
`;

export const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
