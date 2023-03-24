import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useTransition, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_LIST_MEMBERS, PANEL_ADD_MEMBERS } from '@/app/router';
import { useGetTaskIdQuery, useGetTesteesQuery } from '@/api';
import { setSelectedMembers } from '@/api/state';
import type { FriendsType, TaskType } from '@/app/types';

import { FooterWithButton } from '../components';
import { MembersList } from './components';
import { useMembersSelection } from '../hooks';

export const AddMemmbersPage: FC = () => {
    const { collectionId } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const [, startTransition] = useTransition();
    const [search, setSearch] = useState('');
    const [seacrhQuery, setSearchQuery] = useState('');

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const { data: testees = [] as FriendsType[], isLoading } = useGetTesteesQuery({
        search: seacrhQuery,
        count: 50,
    });

    const changeSeacrh = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        startTransition(() => {
            setSearchQuery(e.target.value);
        });
    };

    const [allTestees, setAllTestees] = useState<FriendsType[]>([]);

    useEffect(() => {
        if (!search.length) {
            setAllTestees(testees);
        }
    }, [search, testees]);

    const selection = useMembersSelection(
        [],
        testees.map((el) => el.id),
        allTestees,
    );

    const goBack = () => {
        router.popPage();
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

            {!isLoading && testees.length > 0 && (
                <MembersList
                    selection={selection}
                    collection={testees}
                />
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
