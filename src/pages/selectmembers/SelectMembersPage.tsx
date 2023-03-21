import { useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_LIST_MEMBERS, PANEL_SELECT_MEMBERS } from '@/app/router';
import { useVkGetFriends } from '@/api';
import { setSelectedMembers } from '@/api/state';

import { FooterWithButton } from '../components';
import { CollectionMembers } from './components';
import { useMembersSelection } from './hooks';

export const SelectMembersPage: FC = () => {
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    const { friends, isLoading } = useVkGetFriends(search);

    const selection = useMembersSelection(
        [],
        friends.map((el): string => String(el.id)),
        friends,
    );

    return (
        <Panel id={PANEL_SELECT_MEMBERS}>
            <FixedLayout
                filled
                vertical='top'
            >
                <PanelHeaderCentered before={<PanelHeaderBack onClick={goBack} />}>
                    Выбор участников
                </PanelHeaderCentered>

                <SearchInput
                    after=''
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </FixedLayout>

            {isLoading && friends.length > 0 && (
                <CollectionMembers
                    selection={selection}
                    collection={friends}
                />
            )}

            <FooterWithButton
                primary
                text='Продолжить'
                onClick={() => {
                    dispatch(setSelectedMembers(selection.selectedCollection));
                    router.pushPage(PANEL_LIST_MEMBERS);
                }}
            />
        </Panel>
    );
};

const SearchInput = styled(Search)`
    padding: 16px 16px 14px 16px;
`;
