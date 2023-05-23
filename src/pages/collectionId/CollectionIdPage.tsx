import { useParams, useRouter } from '@happysanta/router';
import {
    FixedLayout,
    MiniInfoCell,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    Search,
    Spacing,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { createRef, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon20ReportOutline } from '@vkontakte/icons';

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
import { useBridgePlatform, useSearch } from '@/hooks';
import { checkIsMobilePlatform, errorParser, normalizeTestees } from '@/lib/utils';
import type { ButtonOption } from '@/components';
import { Popout, FooterWithButton } from '@/components';
import { SnackBarMessage } from '@/components/SnackBarMessage';

import { CompletedMembers, NotCompletedMembers } from './components/collectionMembers';
import { HeaderButtons } from './components/headerButtons';
import { CopyUploadLink } from './components/headerButtons/components';
import { CollectionTabs } from './components/CollectionTabs';
import { SkeletonMembers } from './components/collectionMembers/components/SkeletonMembers';
import { ShareLink } from './components/ShareLink';

export type TabType = 'completed' | 'notCompleted';

const payloadCloseTask = {
    fields: [{ fieldName: 'status', value: 'DONE' }],
};

interface CollectionIdProps {
    id?: string;
}

export const CollectionIdPage: FC<CollectionIdProps> = () => {
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

    const platform = useBridgePlatform();
    const isMobilePlatform = checkIsMobilePlatform(platform);

    const [fixLayoutHeight, setFixLayoutHeight] = useState(0);
    const fixedLayoutRef = createRef<HTMLDivElement>();

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

        if (normalizedTestees.completed.length > 0 && !isMobilePlatform) {
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

    useLayoutEffect(() => {
        setFixLayoutHeight(fixedLayoutRef.current.firstChild.offsetHeight);
    }, [selectedTab, isTaskClosed, fixedLayoutRef]);

    if (error?.status) {
        const errorMessage = errorParser(error?.status);

        throw Error(errorMessage);
    }

    return (
        <Panel
            id={PANEL_COLLECTION_ID}
            data-automation-id='collectionId-page-panel'
        >
            <div ref={fixedLayoutRef}>
                <FixedLayout
                    filled
                    vertical='top'
                >
                    <PanelHeader
                        separator={false}
                        before={<PanelHeaderBack onClick={goBack} />}
                    >
                        {currentTask?.name ? (
                            <PanelHeaderContent
                                status={currentTask.name}
                                data-automation-id='collectionId-page-headerContent'
                            >
                                {isTaskClosed ? 'Завершенное задание' : 'Активное задание'}
                            </PanelHeaderContent>
                        ) : (
                            <PanelHeaderSkeleton />
                        )}
                    </PanelHeader>

                    {/* For unpredictable problems caused by vk api */}
                    {apiMessageError && (
                        <MiniInfoCell
                            before={<Icon20ReportOutline />}
                            textWrap='full'
                            mode='base'
                        >
                            Некоторый функционал приложения временно недоступен в мобильной версии.
                            Воспользуйтесь Desktop версией приложения. Приносим свои извинения за
                            неудобства.
                        </MiniInfoCell>
                    )}

                    <Search
                        value={search}
                        data-automation-id='common-searchBar'
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

                    <Spacing size={8} />
                </FixedLayout>
            </div>

            <ListContainer $fixedLayoutHeight={`${fixLayoutHeight}`}>
                {!isLoading ? (
                    <>
                        {selectedTab === 'completed' ? (
                            <>
                                {normalizedTestees.completed.length > 0 && (
                                    <CompletedMembers
                                        collectionId={collectionId}
                                        taskResults={normalizedTestees.completed}
                                        isMobilePlatform={isMobilePlatform}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {normalizedTestees.notCompleted.length > 0 ? (
                                    <NotCompletedMembers
                                        setSnackbarText={setSnackbarText}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        taskResults={normalizedTestees.notCompleted}
                                        apiMessageError={apiMessageError}
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

const ListContainer = styled.div<{ $fixedLayoutHeight: string }>`
    padding-top: ${({ $fixedLayoutHeight }) => `${$fixedLayoutHeight}px`};
    padding-bottom: 52px;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
