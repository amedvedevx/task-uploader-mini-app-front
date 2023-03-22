import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PANEL_LIST_MEMBERS } from '@/app/router';
import type { RootState } from '@/api';
import { useGetTaskIdQuery, useApointTaskMutation } from '@/api';
import { useSearch } from '@/hooks';
import type { TaskType } from '@/app/types';

import { FooterWithButton } from '../components';
import { MembersList } from '../addmembers/components';
import { useMembersSelection } from '../hooks';

export const ListMembersPage: FC = () => {
    const { collectionId } = useParams();

    const { selectedMembers } = useSelector((state: RootState) => state.members);

    const vkUserIds = selectedMembers.map((el) => el.id);

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const selection = useMembersSelection(
        [],
        selectedMembers.map((el) => el.id),
        selectedMembers,
    );

    const [apointTask] = useApointTaskMutation();

    const assignMembers = async (memberIds: number[]) => {
        const payload = {
            taskId: collectionId,
            vkUserIds,
        };

        await apointTask({ payload }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId });
    };

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
                <PanelHeaderCentered
                    separator={false}
                    before={<PanelHeaderBack onClick={goBack} />}
                >
                    {currentTask ? (
                        <PanelHeaderContentCentered status={currentTask.name}>
                            Список участников
                        </PanelHeaderContentCentered>
                    ) : (
                        <PanelHeaderSkeleton />
                    )}
                </PanelHeaderCentered>

                <Search
                    after=''
                    value={search}
                    onChange={changeSearch}
                />
            </FixedLayout>

            {selectedMembers.length > 0 && (
                <MembersList
                    selection={selection}
                    collection={filteredData}
                />
            )}

            <FooterWithButton
                primary
                text='Готово'
                onClick={() => {
                    assignMembers(vkUserIds);
                    router.pushPage(PAGE_COLLECTION_ID, { collectionId: currentTask.id });
                }}
            />
        </Panel>
    );
};
