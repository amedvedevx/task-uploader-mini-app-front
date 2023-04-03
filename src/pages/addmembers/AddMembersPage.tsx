import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_LIST_MEMBERS, PANEL_ADD_MEMBERS } from '@/app/router';
import { useGetTesteesQuery, useGetTaskIdQuery, useGetConversationsTesteesQuery } from '@/api';
import { setSelectedChatMembers, setSelectedMembers } from '@/api/state';
import type { FriendsType, GetTesteesResponse, TaskType } from '@/app/types';
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

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const { data: testees = {} as GetTesteesResponse, isLoading } = useGetTesteesQuery({
        search: searchQuery,
        count: 50,
    });

    const [members, setMembers] = useState<FriendsType[]>([]);

    useEffect(() => {
        if (!search.length && !isLoading) {
            setMembers(testees.profiles);
        }
    }, [search, testees, isLoading]);

    const selection = useMembersSelection(
        [],
        testees.profiles?.map((el) => el.id),
        testees.items?.map((el) => el.peer.id),
        members,
    );

    const { data: chatMembers } = useGetConversationsTesteesQuery({
        conversationsIds: selection.selectedChats,
    });

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

            {(!isLoading && testees.items?.length > 0) || testees.profiles?.length > 0 ? (
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
                            dispatch(setSelectedChatMembers({ members: chatMembers }));
                            router.pushPage(PAGE_LIST_MEMBERS, { collectionId: currentTask.id });
                        },
                        loading: false,
                    },
                ]}
            />
        </Panel>
    );
};
