import { useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PANEL_COLLECTION_ID, PANEL_LIST_MEMBERS_ID } from '@/app/router';
import type { RootState } from '@/api';
import { useCreateWideTaskMutation } from '@/api';
import { useSearch } from '@/hooks';

import { FooterWithButton } from '../components';
import { CollectionMembers } from '../addmembers/components';
import { useMembersSelection } from '../addmembers/hooks';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);

export const ListMembersPage: FC = () => {
    const { selectedMembers } = useSelector((state: RootState) => state.members);

    const selection = useMembersSelection(
        [],
        selectedMembers.map((el): string => String(el.id)),
        selectedMembers,
    );

    const [createWideTask] = useCreateWideTaskMutation();

    const assignVkUsers = async (name: string) => {
        const payload = {
            name: '',
            description: `Описание - ${''}`,
            unlimited: false,
            deadLine: deadLineDate,
        };

        const taskId: string = await createWideTask({ payload }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId: taskId });
    };

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    const { search, changeSearch, filteredData } = useSearch(selectedMembers, 'first_name');

    return (
        <Panel id={PANEL_LIST_MEMBERS_ID}>
            <FixedLayout
                filled
                vertical='top'
            >
                <PanelHeaderCentered before={<PanelHeaderBack onClick={goBack} />}>
                    Список участников
                </PanelHeaderCentered>

                <SearchInput
                    after=''
                    value={search}
                    onChange={changeSearch}
                />
            </FixedLayout>

            {selectedMembers.length > 0 && (
                <CollectionMembers
                    selection={selection}
                    collection={filteredData}
                />
            )}

            <FooterWithButton
                primary
                text='Готово'
                onClick={() => router.pushPage(PANEL_COLLECTION_ID)}
            />
        </Panel>
    );
};

const SearchInput = styled(Search)`
    padding: 16px 16px 14px 16px;
`;
