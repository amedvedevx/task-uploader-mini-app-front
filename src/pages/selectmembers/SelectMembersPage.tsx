import { useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_SELECT_MEMBERS } from '@/app/router';
import { useVkGetFriends } from '@/api';
import { useSearch } from '@/hooks';

import { FooterWithButton } from '../components';
import { CollectionFriends } from './components';

export const SelectMembersPage: FC = () => {
    const router = useRouter();

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const { friends } = useVkGetFriends();

    const { filteredData, search, changeSearch } = useSearch(friends, 'first_name');

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
                    value={search}
                    onChange={changeSearch}
                />
            </FixedLayout>

            {friends.length > 0 && <CollectionFriends collection={filteredData} />}

            <FooterWithButton
                primary
                text='Продолжить'
                onClick={() => {}}
            />
        </Panel>
    );
};

const SearchInput = styled(Search)`
    padding: 16px 16px 14px 16px;
`;
