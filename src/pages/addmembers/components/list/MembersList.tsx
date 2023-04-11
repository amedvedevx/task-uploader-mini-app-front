import type { FC } from 'react';
import { SimpleCell, Header as HeaderRoot } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TesteeType, GetTesteesResponse } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';

import { SearchMembers, SelectedMembers } from './components';

interface MembersListProps {
    searchMembers?: GetTesteesResponse;
    selectedMembers?: TesteeType[];
    deleteMember?: (id: number) => void;
    selection?: UseMembersSelectionResult;
}

export const avatarStub = 'https://vk.com/images/camera_100.png';

export const MembersList: FC<MembersListProps> = ({
    searchMembers,
    deleteMember,
    selectedMembers,
    selection,
}) => (
    <MembersListWrapper>
        {searchMembers?.profiles.length > 0 && (
            <SearchMembers
                selection={selection}
                collection={searchMembers}
            />
        )}

        {selectedMembers?.length > 0 && (
            <SelectedMembers
                collection={selectedMembers}
                deleteMember={deleteMember}
            />
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
