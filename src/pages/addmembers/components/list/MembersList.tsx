import type { FC } from 'react';
import { SimpleCell, Header as HeaderRoot } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { FriendsType, GetTesteesResponse, TaskResults } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';
import type { SelectedChatMembersType } from '@/api/state';

import { InvitedMembers, SearchMembers, SelectedChatMembers, SelectedMembers } from './components';

interface MembersListProps {
    searchMembers?: GetTesteesResponse;
    invitedMembers?: TaskResults['testee'][];
    selectedMembers?: FriendsType[];
    selectedChatMembers?: SelectedChatMembersType[];
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
    <MembersListWrapper>
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
    </MembersListWrapper>
);

const MembersListWrapper = styled.div`
    padding-top: 103px;
    padding-bottom: 45px;
`;

export const Header = styled(HeaderRoot)`
    .vkuiHeader__main {
        color: var(--vkui--color_text_subhead);
    }
`;

export const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
