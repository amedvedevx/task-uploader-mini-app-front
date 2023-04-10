import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_LIST_MEMBERS, PANEL_ADD_MEMBERS } from '@/app/router';
import {
    useGetTesteesQuery,
    useGetTaskIdQuery,
    useGetChatTesteesQuery,
    useGetTaskResultsQuery,
} from '@/api';
import { setSelectedChatMembers, setSelectedMembers } from '@/api/state';
import type { GetTesteesResponse, TaskType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';

import { MembersList } from './components';
import { useMembersSelection } from '../hooks';

const maxTesteeItems = 205;

export const AddMemmbersPage: FC = () => {
    const { collectionId } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const [conversationsCount, setConversationsCount] = useState(50);
    const [itemLength, setItemLength] = useState(0);

    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const { data = { taskResults: [] } } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const invitedMembersIds = taskResults.map((result) => result.testee.vkUserId);

    const { data: testees = {} as GetTesteesResponse, isLoading } = useGetTesteesQuery({
        search: searchQuery,
        count: conversationsCount,
        invitedMembersIds,
    });

    const selection = useMembersSelection();

    const { data: chatMembers = [] } = useGetChatTesteesQuery({
        chats: selection.selectedChats,
        invitedMembersIds,
    });

    useEffect(() => {
        if (!isLoading && testees.profiles.length < maxTesteeItems) {
            setItemLength(testees.profiles.length);
        }
    }, [isLoading, testees]);

    const goBack = () => {
        router.popPage();
    };

    const changeSeacrh = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        clearTimeout(timer);

        const newTimer = setTimeout(() => {
            setSearchQuery(e.target.value);
        }, 500);

        setTimer(newTimer);
    };

    const selectedMembers = selection.selectedMembers.concat(selection.selectedChats);

    return (
        <Panel id={PANEL_ADD_MEMBERS}>
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
                            Добавьте участников
                        </PanelHeaderContentCentered>
                    ) : (
                        <PanelHeaderSkeleton />
                    )}
                </PanelHeaderCentered>

                <Search
                    after=''
                    value={search}
                    onChange={changeSeacrh}
                />
            </FixedLayout>

            <InfiniteScroll
                hasMore
                dataLength={itemLength}
                next={() => setConversationsCount(conversationsCount + 50)}
                scrollThreshold={0.7}
                loader={false}
            >
                <>
                    {!isLoading && testees.profiles.length > 0 ? (
                        <MembersList
                            selection={selection}
                            searchMembers={testees}
                        />
                    ) : (
                        <MembersNotFound />
                    )}
                </>
            </InfiniteScroll>

            <FooterWithButton
                options={[
                    {
                        text: 'Продолжить',
                        disabled: !selectedMembers.length,
                        onClick: () => {
                            dispatch(setSelectedMembers(selection.selectedMembers));
                            dispatch(setSelectedChats(selection.selectedChats));
                            router.pushPage(PAGE_LIST_MEMBERS, { collectionId: currentTask.id });
                        },
                        loading: false,
                    },
                ]}
            />
        </Panel>
    );
};
