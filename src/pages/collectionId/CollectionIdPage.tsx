import { useParams, useRouter } from '@happysanta/router';
import { FixedLayout, Panel, PanelHeaderBack, Search, Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import { Icon28CheckCircleOutline } from '@vkontakte/icons';
import styled from 'styled-components';

import {
    PanelHeaderCentered,
    PanelHeaderContentCentered,
    PanelHeaderSkeleton,
} from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import {
    useGetTaskIdQuery,
    useGetTaskResultsQuery,
    useLazyDownloadFilesQuery,
    useUpdateTaskMutation,
} from '@/api';
import type { TaskType } from '@/app/types';
import { TaskStatusTypesForOrganizer } from '@/app/types';
import { useSearch } from '@/hooks';

import { FooterWithButton } from '../components';
import { CollectionMembers } from './components/collectionMembers';
import { HeaderButtons } from './components/headerButtons';
import { CopyUploadLink } from './components/headerButtons/components';
import type { ButtonOption } from '../components/FooterWithButton';
import { CollectionTabs } from './components/CollectionTabs';
import { SkeletonMembers } from './components/collectionMembers/components/SkeletonMembers';

export type TabType = 'completed' | 'notCompleted';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const {
        data = { taskResults: [] },
        isLoading,
        error,
    } = useGetTaskResultsQuery({
        taskId: collectionId,
    });
    const { taskResults } = data;

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });
    const [updateTask, { isLoading: isTaskUpdating }] = useUpdateTaskMutation();
    const [downloadFiles, { isLoading: isFileDownloading }] = useLazyDownloadFilesQuery();

    const { filteredData, search, changeSearch } = useSearch(taskResults, ['testee', 'fullName']);

    const [selectedTab, setSelectedTab] = useState<TabType>('notCompleted');
    const [snackbarText, setSnackbarText] = useState<string>('');

    const isTaskClosed = currentTask.status === TaskStatusTypesForOrganizer.DONE;

    const prepareButtonsOptions = (): ButtonOption[] => {
        const downloadAllButton = {
            text: 'Скачать все файлы',
            onClick: () => downloadFiles({ taskId: collectionId }),
            loading: isFileDownloading,
            mode: 'primary',
        };
        const closeTaskButton = {
            text: 'Завершить сбор',
            onClick: () => handleUpdateTask(collectionId),
            loading: isTaskUpdating,
            mode: 'secondary',
            appearance: 'negative',
        };

        if (isTaskClosed) {
            return [downloadAllButton];
        }

        if (taskResults.length === 0) {
            return [closeTaskButton];
        }

        return [downloadAllButton, closeTaskButton];
    };

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const handleUpdateTask = (id: string) => {
        const payload = {
            fields: [{ fieldName: 'status', value: 'DONE' }],
        };

        updateTask({ taskId: id, payload });
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
                    <PanelHeaderContentCentered status={currentTask.name}>
                        {isTaskClosed ? 'Завершенное задание' : 'Активное задание'}
                    </PanelHeaderContentCentered>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeaderCentered>

            <FixedLayout
                filled
                vertical='top'
            >
                <Search
                    value={search}
                    onChange={changeSearch}
                />

                {!isTaskClosed && (
                    <CopyUploadLink
                        setSnackbarText={setSnackbarText}
                        collectionId={collectionId}
                    />
                )}

                <CollectionTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    taskUsersConsolidated={currentTask.consolidatedData}
                />
            </FixedLayout>

            <ListContainer $isTaskClosed={isTaskClosed}>
                {!isLoading ? (
                    <>
                        {selectedTab === 'completed' && (
                            <>
                                {taskResults.length > 0 && (
                                    <CollectionMembers
                                        setSnackbarText={setSnackbarText}
                                        selectedTab={selectedTab}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        taskResults={filteredData}
                                    />
                                )}
                            </>
                        )}

                        {selectedTab === 'notCompleted' && (
                            <>
                                {!isTaskClosed && (
                                    <HeaderButtons
                                        isResults={taskResults.length > 0}
                                        collectionId={collectionId}
                                    />
                                )}

                                {taskResults.length > 0 && (
                                    <CollectionMembers
                                        selectedTab={selectedTab}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        setSnackbarText={setSnackbarText}
                                        taskResults={filteredData}
                                    />
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <SkeletonMembers />
                )}
            </ListContainer>

            {snackbarText && (
                <Snackbar
                    before={<Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />}
                    onClose={() => setSnackbarText('')}
                >
                    {snackbarText}
                </Snackbar>
            )}

            <FooterWithButton options={prepareButtonsOptions()} />
        </Panel>
    );
};

const ListContainer = styled.div<{ $isTaskClosed: boolean }>`
    padding-top: ${({ $isTaskClosed }) => ($isTaskClosed ? '108px' : '170px')};
    padding-bottom: 52px;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
