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
import { useState } from 'react';
import styled from 'styled-components';

import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import {
    store,
    useGetTaskIdQuery,
    useGetTaskResultsQuery,
    useLazyDownloadFilesQuery,
    useUpdateTaskMutation,
} from '@/api';
import type { SnackBarText, TaskType } from '@/app/types';
import { TaskStatusTypesForOrganizer } from '@/app/types';
import { useSearch } from '@/hooks';
import { normalizeTestees } from '@/lib/utils';
import type { ButtonOption } from '@/components';
import { Popout, FooterWithButton } from '@/components';
import { SnackBarMessage } from '@/components/SnackBarMessage';

import { CollectionMembers } from './components/collectionMembers';
import { HeaderButtons } from './components/headerButtons';
import { CopyUploadLink } from './components/headerButtons/components';
import { CollectionTabs } from './components/CollectionTabs';
import { SkeletonMembers } from './components/collectionMembers/components/SkeletonMembers';
import { ShareLink } from './components/ShareLink';

export type TabType = 'completed' | 'notCompleted';

const payloadCloseTask = {
    fields: [{ fieldName: 'status', value: 'DONE' }],
};

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

    const [popout, setPopout] = useState<JSX.Element | null>(null);

    const [selectedTab, setSelectedTab] = useState<TabType>('notCompleted');
    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const { filteredData, search, changeSearch } = useSearch(taskResults, ['testee', 'fullName']);

    const normalizedTestees = normalizeTestees(filteredData);

    const isTaskClosed = currentTask.status === TaskStatusTypesForOrganizer.DONE;

    const stateErrors = store.getState().errors;
    const apiMessageError = stateErrors.find((errorObj) => errorObj.type === 'api-messages');

    const popoutCloseTask = (
        <Popout
            text='Вы уверены, что хотите завершить сбор?'
            header='Завершить задание'
            action={async () => {
                await updateTask({ taskId: collectionId, payload: payloadCloseTask });
                setSnackbarText({ type: 'success', text: 'Задание по сбору завершено' });
            }}
            actionText='Завершить сбор'
            setPopout={setPopout}
        />
    );

    const prepareButtonsOptions = (): ButtonOption[] => {
        const downloadAllButton: ButtonOption = {
            text: 'Скачать все файлы',
            onClick: () => downloadFiles({ taskId: collectionId }),
            loading: isFileDownloading,
            mode: 'primary',
        };
        const closeTaskButton: ButtonOption = {
            text: 'Завершить сбор',
            onClick: () => handleUpdateTask(),
            loading: isTaskUpdating,
            mode: 'secondary',
            appearance: 'negative',
        };

        const closedTask: ButtonOption = {
            text: 'Сбор завершен',
            onClick: () => {},
            loading: false,
            disabled: true,
            mode: 'secondary',
            appearance: 'negative',
        };

        const buttonOptions = [];

        if (normalizedTestees.completed.length > 0) {
            buttonOptions.push(downloadAllButton);
        }

        if (!isTaskClosed) {
            buttonOptions.push(closeTaskButton);
        } else {
            buttonOptions.push(closedTask);
        }

        return buttonOptions;
    };

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const changePageHandler = (page: string) => {
        if (page === PAGE_ADD_MEMBERS && !!apiMessageError) {
            setSnackbarText({ type: 'error', text: apiMessageError.text });

            return;
        }
        router.pushPage(page, { collectionId });
    };

    const handleUpdateTask = () => {
        setPopout(popoutCloseTask);
    };

    if (error?.status) {
        const errorMessage =
            error?.status === 400
                ? 'Такого сбора не существует'
                : 'Вы не являетесь создаталем сбора. Доступ запрещен';

        throw Error(errorMessage);
    }

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeader
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                {currentTask?.name ? (
                    <PanelHeaderContent status={currentTask.name}>
                        {isTaskClosed ? 'Завершенное задание' : 'Активное задание'}
                    </PanelHeaderContent>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeader>

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
                        currentTask={currentTask}
                    />
                )}

                <CollectionTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    taskUsersConsolidated={currentTask.consolidatedData}
                />

                {selectedTab === 'notCompleted' && !isTaskClosed && (
                    <HeaderButtons
                        isTestees={normalizedTestees.notCompleted.length > 0}
                        changePageHandler={changePageHandler}
                        setPopout={setPopout}
                        setSnackbarText={setSnackbarText}
                        apiMessageError={apiMessageError}
                    />
                )}
            </FixedLayout>

            <ListContainer $isTaskClosed={isTaskClosed}>
                {!isLoading ? (
                    <>
                        {selectedTab === 'completed' ? (
                            <>
                                {normalizedTestees.completed.length > 0 && (
                                    <CollectionMembers
                                        selectedTab={selectedTab}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        taskResults={normalizedTestees.completed}
                                        setSnackbarText={setSnackbarText}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {normalizedTestees.notCompleted.length > 0 ? (
                                    <CollectionMembers
                                        setSnackbarText={setSnackbarText}
                                        selectedTab={selectedTab}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        taskResults={normalizedTestees.notCompleted}
                                    />
                                ) : (
                                    <ShareLink
                                        currentTask={currentTask}
                                        setSnackbarText={setSnackbarText}
                                        changePageHandler={changePageHandler}
                                    />
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <SkeletonMembers selectedTab={selectedTab} />
                )}
            </ListContainer>

            {snackbarText && (
                <SnackBarMessage
                    snackbarText={snackbarText}
                    setSnackbarText={setSnackbarText}
                />
            )}

            {popout}

            <FooterWithButton options={prepareButtonsOptions()} />
        </Panel>
    );
};

const ListContainer = styled.div<{ $isTaskClosed: boolean }>`
    margin-top: ${({ $isTaskClosed }) => ($isTaskClosed ? '108px' : '170px')};
    margin-bottom: 52px;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
