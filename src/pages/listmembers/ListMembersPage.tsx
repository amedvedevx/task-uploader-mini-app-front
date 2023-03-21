import { useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PANEL_LIST_MEMBERS } from '@/app/router';
import type { RootState } from '@/api';
import { useCreateWideTaskMutation } from '@/api';
import { useSearch } from '@/hooks';

import { FooterWithButton } from '../components';
import { CollectionMembers } from '../selectmembers/components';
import { useMembersSelection } from '../selectmembers/hooks';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);

export const ListMembersPage: FC = () => {
    const { selectedMembers } = useSelector((state: RootState) => state.members);
    const { taskName } = useSelector((state: RootState) => state.task);

    const [createWideTask] = useCreateWideTaskMutation();

    const createTask = async (name: string) => {
        const payload = {
            name: taskName,
            description: `Описание - ${taskName}`,
            unlimited: true,
            deadLine: deadLineDate,
        };

        const taskId: string = await createWideTask({ payload }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId: taskId });
    };

    const selection = useMembersSelection(
        [],
        selectedMembers.map((el): string => String(el.id)),
        selectedMembers,
    );

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    const { search, changeSearch, filteredData } = useSearch(selectedMembers, 'first_name');

    return (
        <Panel id={PANEL_LIST_MEMBERS}>
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
                text='Создать сбор'
                onClick={() => createTask(taskName)}
            />
        </Panel>
    );
};

const SearchInput = styled(Search)`
    padding: 16px 16px 14px 16px;
`;
