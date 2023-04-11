import { useParams, useRouter } from '@happysanta/router';
import {
    FixedLayout,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    Search,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_ID, PANEL_LIST_MEMBERS } from '@/app/router';
import type { RootState } from '@/api';
import {
    useSendNotificationMutation,
    useGetTaskResultsQuery,
    useGetTaskIdQuery,
    useApointTaskMutation,
} from '@/api';
import { useSearch } from '@/hooks';
import type { TaskType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';

import { MembersList } from '../addmembers/components';

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
    const [sendNotification] = useSendNotificationMutation();

    const { selectedMembers, selectedChatMembers } = useSelector(
        (state: RootState) => state.members,
    );

    const chatMemberIds = selectedChatMembers
        .map((el) => el.members.map((member) => member.id))
        .flat();

    const vkUserIds = chatMemberIds.concat(selectedMembers.map((el) => el.id));

    const { search, changeSearch, filteredData } = useSearch(selectedMembers, 'first_name');

    const assignMembers = async (membersIds: number[]) => {
        const payload = {
            taskId: collectionId,
            vkUserIds: membersIds,
        };

        await apointTask({ payload }).unwrap();

        await sendNotification({
            taskId: collectionId,
            ownerName: currentTask.owner.fullName,
            whoToSend: membersIds,
            taskName: currentTask.name,
        }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId });
    };

    useEffect(() => {
        if (!vkUserIds.length) {
            router.pushPage(PAGE_ADD_MEMBERS, { collectionId });
        }
    }, [vkUserIds, router, collectionId]);

    const goBack = () => {
        router.popPage();
    };

    const isMembers =
        selectedChatMembers.length > 0 || filteredData.length > 0 || invitedMembers.length > 0;

    return (
        <Panel id={PANEL_LIST_MEMBERS}>
            <FixedLayout
                filled
                vertical='top'
            >
                <PanelHeader
                    separator={false}
                    before={<PanelHeaderBack onClick={goBack} />}
                >
                    {currentTask ? (
                        <PanelHeaderContent status={currentTask.name}>
                            Список участников
                        </PanelHeaderContent>
                    ) : (
                        <PanelHeaderSkeleton />
                    )}
                </PanelHeader>

                <Search
                    after=''
                    value={search}
                    onChange={changeSearch}
                />
            </FixedLayout>

            {isMembers ? (
                <MembersList
                    invitedMembers={invitedMembers}
                    selectedMembers={filteredData}
                    selectedChatMembers={selectedChatMembers}
                />
            ) : (
                <MembersNotFound />
            )}

            <FooterWithButton
                options={[
                    {
                        text: 'Добавить',
                        counter: vkUserIds.length,
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
