import { useLocation, useRouter } from '@happysanta/router';
import {
    FixedLayout,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    Search,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { createRef, useLayoutEffect, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_ID, PANEL_LIST_MEMBERS } from '@/app/router';
import type { RootState } from '@/api';
import {
    useGetChatTesteesQuery,
    useSendNotificationMutation,
    useGetTaskResultsQuery,
    useGetTaskIdQuery,
    useAppointUsersToTaskMutation,
    useGetUserIdQuery,
} from '@/api';
import { useSearch } from '@/hooks';
import type { TaskType, TesteeType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';
import { normalizeMembers } from '@/lib';
import { ListContainer } from '@/components/ListContainer';

import { MembersList } from '../addmembers/components';

interface ListMembersPageProps {
    id?: string;
}

export const ListMembersPage: FC<ListMembersPageProps> = () => {
    const {
        route: {
            params: { collectionId },
        },
    } = useLocation();
    const router = useRouter();
    const { data: userId } = useGetUserIdQuery();

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
    const [appointUsersToTask, appointStatus] = useAppointUsersToTaskMutation();
    const [sendNotification, statusNotification] = useSendNotificationMutation();

    const [localMembers, setLocalMembers] = useState<TesteeType[]>([]);
    const [fixLayoutHeight, setFixLayoutHeight] = useState(0);
    const fixedLayoutRef = createRef<HTMLDivElement>();

    const vkUserIds = localMembers.map((el) => el.id);

    const deleteMember = (id: number) => {
        setLocalMembers((prev) => prev.filter((el) => el.id !== id));
    };

    const { search, changeSearch, filteredData } = useSearch<TesteeType>(localMembers, 'full_name');

    const assignMembers = async (membersIds: number[]) => {
        const payload = {
            taskId: collectionId,
            vkUserIds: membersIds,
        };

        await appointUsersToTask({ payload }).unwrap();

        await sendNotification({
            taskId: collectionId,
            task: currentTask,
            whoToSend: membersIds,
        }).unwrap();
        router.pushPage(PAGE_COLLECTION_ID, { collectionId });
    };

    const goBack = () => {
        router.popPage();
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!vkUserIds.length) {
                router.pushPage(PAGE_ADD_MEMBERS, { collectionId });
            }
        }, 2000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vkUserIds]);

    useEffect(() => {
        if (isLoading) return;

        const allMembers = selectedMembers
            .concat(chatMembers)
            .filter((item) => item.id > 0 && item.id !== userId);

        setLocalMembers(normalizeMembers(allMembers));
    }, [isLoading, selectedMembers, chatMembers, userId]);

    useLayoutEffect(() => {
        const childNode: HTMLElement = fixedLayoutRef.current?.firstChild as HTMLElement;

        if (!childNode) {
            return;
        }

        setFixLayoutHeight(childNode.offsetHeight);
    }, [fixedLayoutRef]);

    return (
        <Panel id={PANEL_LIST_MEMBERS}>
            <div ref={fixedLayoutRef}>
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
            </div>

            <ListContainer $fixedLayoutHeight={`${fixLayoutHeight}`}>
                {filteredData.length > 0 ? (
                    <MembersList
                        selectedMembers={filteredData}
                        deleteMember={deleteMember}
                    />
                ) : (
                    <MembersNotFound />
                )}
            </ListContainer>

            <FooterWithButton
                options={[
                    {
                        text: 'Добавить',
                        counter: vkUserIds.length,
                        onClick: () => {
                            assignMembers(vkUserIds);
                        },
                        loading: appointStatus.isLoading || statusNotification.isLoading,
                    },
                ]}
            />
        </Panel>
    );
};
