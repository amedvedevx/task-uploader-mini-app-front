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
import { useGetTaskResultsQuery, useGetTaskIdQuery, useApointTaskMutation } from '@/api';
import { useSearch } from '@/hooks';
import type { TaskType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';

import { MembersList } from '../addmembers/components';
import { useMembersSelection } from '../hooks';

export const ListMembersPage: FC = () => {
    const { collectionId } = useParams();
    const router = useRouter();

    const { data = { taskResults: [] } } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const invitedMembers = taskResults.map((result) => result.testee);

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const [apointTask] = useApointTaskMutation();

    const { selectedMembers } = useSelector((state: RootState) => state.members);
    const selection = useMembersSelection(
        [],
        selectedMembers.map((el) => el.id),
        selectedMembers,
    );
    const vkUserIds = selectedMembers.map((el) => el.id);

    const { search, changeSearch, filteredData } = useSearch(selectedMembers, 'first_name');

    const assignMembers = async (memberIds: number[]) => {
        const payload = {
            taskId: collectionId,
            vkUserIds: memberIds,
        };

        await apointTask({ payload }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId });
    };

    const goBack = () => {
        router.popPage();
    };

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

            {filteredData.length > 0 ? (
                <MembersList
                    invitedMembers={invitedMembers}
                    selection={selection}
                    collection={filteredData}
                />
            ) : (
                <MembersNotFound />
            )}

            <FooterWithButton
                options={[
                    {
                        text: 'Добавить',
                        counter: selectedMembers.length,
                        onClick: () => {
                            assignMembers(vkUserIds);
                            router.pushPage(PAGE_COLLECTION_ID, { collectionId: currentTask.id });
                        },
                        loading: false,
                    },
                ]}
            />
        </Panel>
    );
};
