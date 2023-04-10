import type { FC } from 'react';
import { SimpleCell, Header as HeaderRoot } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { FriendsType, GetTesteesResponse, ItemsType } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { InvitedMembers, SearchMembers, SelectedChatMembers, SelectedMembers } from './components';

interface MembersListProps {
    searchMembers?: GetTesteesResponse;
    invitedMembers?: number[];
    selectedMembers?: FriendsType[];
    selectedChats?: ItemsType[];
    selection?: UseMembersSelectionResult;
    setMembers?: React.Dispatch<React.SetStateAction<FriendsType[]>>;
}

export const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({
    searchMembers,
    invitedMembers,
    selectedChats,
    selectedMembers,
    selection,
    setMembers,
}) => (
    <MembersListWrapper>
        {/* {invitedMembers?.length > 0 && <InvitedMembers collection={invitedMembers} />} */}

        {searchMembers?.profiles.length > 0 && (
            <SearchMembers
                selection={selection}
                collection={searchMembers}
            />
        )}

        {selectedChats?.length > 0 && (
            <SelectedChatMembers
                collection={selectedChats}
                invitedMembersIds={invitedMembers}
                setMembers={setMembers}
            />
        )}

        {selectedMembers?.length > 0 && <SelectedMembers collection={selectedMembers} />}
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
