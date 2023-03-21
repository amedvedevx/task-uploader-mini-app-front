import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search, Snackbar, Spacing } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import { Icon28CheckCircleOutline } from '@vkontakte/icons';
import { useSelector } from 'react-redux';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import type { RootState } from '@/api';
import { useGetTaskIdQuery, useGetTaskResultsQuery, useUpdateTaskMutation } from '@/api';
import type { TaskType } from '@/app/types';
import { TaskStatusTypesForOrganizer } from '@/app/types';
import { useSearch } from '@/hooks';

import { FooterWithButton } from '../components';
import { ShareLink } from './components/share';
import { CollectionMembers } from './components/list';
import { CollectionTabs } from './components/tabs';
import { HeaderButtons } from './components/headerButtons';

export type TabType = 'completed' | 'notCompleted';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { selectedMembers } = useSelector((state: RootState) => state.members);

    console.log(selectedMembers);

    const {
        data = { taskResults: [] },
        isLoading,
        error,
    } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const { filteredData, search, changeSearch } = useSearch(taskResults, ['testee', 'fullName']);

    const isTaskClosed = currentTask.status === TaskStatusTypesForOrganizer.DONE;
    const [selectedTab, setSelectedTab] = useState<TabType>('completed');
    const [snackbarText, setSnackbarText] = useState<string>('');

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const [updateTask] = useUpdateTaskMutation();

    const handleUpdateTask = async (id: string) => {
        const payload = {
            fields: [{ fieldName: 'status', value: 'DONE' }],
        };

        await updateTask({ taskId: id, payload });
    };

    // TODO - remove error parser from here to api
    if (error?.status) {
        const errorMessage =
            error?.status === 400
                ? 'Такого сбора не существует'
                : 'Вы не являетесь создаталем сбора. Доступ запрещен';

        throw Error(errorMessage);
    }

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                {currentTask ? (
                    <PanelHeaderContentCentered status={isTaskClosed && 'Сбор завершен'}>
                        {currentTask.name}
                    </PanelHeaderContentCentered>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeaderCentered>

            <FixedLayout
                filled
                vertical='top'
            >
                {!currentTask.unlimited && (
                    <CollectionTabs
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        taskUsersConsolidated={currentTask.consolidatedData}
                    />
                )}

                <Search
                    value={search}
                    onChange={changeSearch}
                />

                <Spacing size={2} />

                {!isLoading && taskResults.length > 0 && (
                    <HeaderButtons
                        isTaskClosed={isTaskClosed}
                        collectionId={collectionId}
                        setSnackbarText={setSnackbarText}
                        selectedTab={selectedTab}
                        taskUnlimitedUsers={currentTask.unlimited}
                    />
                )}
            </FixedLayout>

            {!isLoading && (
                <>
                    {selectedTab === 'completed' && (
                        <div
                            id='tab-content-completedTasks'
                            aria-labelledby='completedTasks'
                            role='tabpanel'
                        >
                            {taskResults.length > 0 ? (
                                <CollectionMembers
                                    selectedTab={selectedTab}
                                    isTaskClosed={isTaskClosed}
                                    collectionId={collectionId}
                                    taskResults={filteredData}
                                />
                            ) : (
                                !isTaskClosed && (
                                    <ShareLink
                                        setSnackbarText={setSnackbarText}
                                        collectionId={collectionId}
                                    />
                                )
                            )}
                        </div>
                    )}

                    {selectedTab === 'notCompleted' && (
                        <div
                            id='tab-content-notCompletedTasks'
                            aria-labelledby='notCompletedTasks'
                            role='tabpanel'
                        >
                            <CollectionMembers
                                isTaskUnlimited
                                selectedTab={selectedTab}
                                isTaskClosed={isTaskClosed}
                                collectionId={collectionId}
                                taskResults={filteredData}
                            />
                        </div>
                    )}
                </>
            )}

            {snackbarText && (
                <Snackbar
                    before={<Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />}
                    onClose={() => setSnackbarText('')}
                >
                    {snackbarText}
                </Snackbar>
            )}

            {!isTaskClosed && (
                <FooterWithButton
                    text='Завершить сбор'
                    onClick={() => handleUpdateTask(collectionId)}
                />
            )}
        </Panel>
    );
};
