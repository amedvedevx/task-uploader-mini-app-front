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
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_ID, PANEL_LIST_MEMBERS } from '@/app/router';
import type { RootState } from '@/api';
import {
    useGetChatTesteesQuery,
    useSendNotificationMutation,
    useGetTaskResultsQuery,
    useGetTaskIdQuery,
    useApointTaskMutation,
} from '@/api';
import { useSearch } from '@/hooks';
import type { TaskType, TesteeType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';
import { normalizeMembers } from '@/lib';

import { MembersList } from '../addmembers/components';

export const ListMembersPage: FC = () => {
    const { collectionId } = useParams();
    const router = useRouter();

    const { data = { taskResults: [] } } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const invitedMemberIds = taskResults.map((result) => result.testee.vkUserId);

    const { selectedMembers, selectedChats } = useSelector((state: RootState) => state.members);

    const { data: chatMembers = [], isLoading } = useGetChatTesteesQuery({
        selectedChats,
        invitedMemberIds,
    });

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const [apointTask] = useApointTaskMutation();
    const [sendNotification] = useSendNotificationMutation();

    const [localMembers, setLocalMembers] = useState<TesteeType[]>([]);

    useEffect(() => {
        if (isLoading) return;

        const allMembers = selectedMembers.concat(chatMembers);
        setLocalMembers(normalizeMembers(allMembers));
    }, [isLoading, selectedMembers, chatMembers]);

    const deleteMember = (id: number) => {
        setLocalMembers((prev) => prev.filter((el) => el.id !== id));
    };

    const { search, changeSearch, filteredData } = useSearch(localMembers, 'full_name');

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

    const vkUserIds = localMembers.map((el) => el.id);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!vkUserIds.length) {
                router.pushPage(PAGE_ADD_MEMBERS, { collectionId });
            }
        }, 2000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vkUserIds]);

    const goBack = () => {
        router.popPage();
    };

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

            {filteredData.length > 0 ? (
                <MembersList
                    selectedMembers={filteredData}
                    deleteMember={deleteMember}
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
