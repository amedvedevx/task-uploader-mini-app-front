import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_LIST_MEMBERS, PANEL_ADD_MEMBERS } from '@/app/router';
import {
    useGetTesteesQuery,
    useGetTaskIdQuery,
    useGetTaskResultsQuery,
    useGetConversationsTesteesQuery,
} from '@/api';
import { setSelectedMembers } from '@/api/state';
import type { FriendsType, GetTesteesResponse, ItemsType, TaskType } from '@/app/types';
import { FooterWithButton, MembersNotFound } from '@/components';

import { MembersList } from './components';
import { useMembersSelection } from '../hooks';

export const AddMemmbersPage: FC = () => {
    const { collectionId } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data = { taskResults: [] } } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const invitedMembers = taskResults.map((result) => result.testee.vkUserId);

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const { data: testees = {} as GetTesteesResponse, isLoading } = useGetTesteesQuery({
        search: searchQuery,
        count: 50,
    });

    const [allTestees, setAllTestees] = useState<FriendsType[]>([]);
    const [profiles, setProfiles] = useState<FriendsType[]>([]);
    const [chats, setChats] = useState<ItemsType[]>([]);

    const selection = useMembersSelection(
        [],
        profiles.map((el) => el.id) || [],
        chats.map((el) => el.peer.id),
        allTestees,
    );

    console.log(selection.selectedChats);

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

    useEffect(() => {
        if (!isLoading && !search.length && testees.profiles) {
            setAllTestees(testees.profiles);
        }

        if (!isLoading && testees.profiles) {
            setProfiles(testees.profiles);
        }

        if (!isLoading && testees.items) {
            setChats(testees.items);
        }
    }, [search, testees, isLoading]);

    const { data: members } = useGetConversationsTesteesQuery({
        conversationsIds: selection.selectedChats,
    });

    console.log(members);

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

            {!isLoading && testees.items.length > 0 ? (
                <MembersList
                    selection={selection}
                    collection={testees}
                />
            ) : (
                <MembersNotFound />
            )}

            <FooterWithButton
                options={[
                    {
                        text: 'Продолжить',
                        onClick: () => {
                            dispatch(setSelectedMembers(selection.selectedCollection));
                            router.pushPage(PAGE_LIST_MEMBERS, { collectionId: currentTask.id });
                        },
                        loading: false,
                    },
                ]}
            />
        </Panel>
    );
};
