import { useParams, useRouter } from '@happysanta/router';
import { Div, FixedLayout, Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_LIST_MEMBERS, PANEL_ADD_MEMBERS } from '@/app/router';
import { useGetTaskIdQuery, useVkGetFriends } from '@/api';
import { setSelectedMembers } from '@/api/state';
import type { TaskType } from '@/app/types';

import { FooterWithButton } from '../components';
import { MembersList } from './components';
import { useMembersSelection } from '../hooks';

export const AddMemmbersPage: FC = () => {
    const { collectionId } = useParams();

    const dispatch = useDispatch();

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };
    const [search, setSearch] = useState('');

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const { friends, isLoading } = useVkGetFriends(search);

    const selection = useMembersSelection(
        [],
        friends.map((el) => el.id),
        friends,
    );

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
                    onChange={(e) => setSearch(e.target.value)}
                />
            </FixedLayout>

            {isLoading && friends.length > 0 && (
                <MembersList
                    selection={selection}
                    collection={friends}
                />
            )}

            <FooterWithButton
                primary
                text='Продолжить'
                onClick={() => {
                    dispatch(setSelectedMembers(selection.selectedCollection));
                    router.pushPage(PAGE_LIST_MEMBERS, { collectionId: currentTask.id });
                }}
            />
        </Panel>
    );
};
