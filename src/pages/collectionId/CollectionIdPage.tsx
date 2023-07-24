import { useLocation, useRouter } from '@happysanta/router';
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
import { createRef, useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon20FolderOutline, Icon20ReportOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import {
    store,
    useDeleteTaskResultsMutation,
    useGetAllowedForRemindIdsQuery,
    useGetPlatformQuery,
    useGetTaskIdQuery,
    useGetTaskResultsQuery,
    useLazyDownloadFilesQuery,
    useUpdateTaskMutation,
} from '@/api';
import { TaskStatusTypesForOrganizer, VKPlatforms } from '@/app/types';
import type { SnackBarText, TaskType } from '@/app/types';
import { useSearch } from '@/hooks';
import { errorParser, isForbiddenFile, normalizeTestees } from '@/lib/utils';
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

    const {
        route: {
            params: { collectionId },
        },
    } = useLocation(true, PANEL_COLLECTION_ID);

    const {
        data = { taskResults: [] },
        isLoading,
        error,
        refetch: refetchTaskResults,
    } = useGetTaskResultsQuery({ taskId: collectionId }, { skip: !collectionId });

    const { taskResults } = data;

    const { data: currentTask = {} as TaskType, refetch: refetchTask } = useGetTaskIdQuery(
        { taskId: collectionId },
        { skip: !collectionId },
    );

    const { data: reminds } = useGetAllowedForRemindIdsQuery(
        { taskId: collectionId },
        { skip: !collectionId },
    );
    const [updateTask, { isLoading: isTaskUpdating }] = useUpdateTaskMutation();
    const [downloadFiles, { isLoading: isFileDownloading }] = useLazyDownloadFilesQuery();
    const [deleteMember] = useDeleteTaskResultsMutation();

    const [popout, setPopout] = useState<JSX.Element | null>(null);

    const [selectedTab, setSelectedTab] = useState<TabType>('notCompleted');
    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const { filteredData, search, changeSearch } = useSearch(taskResults, ['testee', 'fullName']);

    const normalizedTestees = normalizeTestees(filteredData);

    const isTaskClosed = currentTask.status === TaskStatusTypesForOrganizer.DONE;

    const stateErrors = store.getState().errors;
    const apiMessageError = stateErrors.find((errorObj) => errorObj.type === 'api-messages');

    const isMobileDownloading = bridge.supports('VKWebAppDownloadFile');
    const { data: appPlatform = '' } = useGetPlatformQuery();
    const isDesktopDownloading = appPlatform === VKPlatforms.DESKTOP_APP_MESSENGER;

    const [fixLayoutHeight, setFixLayoutHeight] = useState(0);

    const fixedLayoutRef = createRef<HTMLDivElement>();

    const popoutCloseTask = (
        <Popout
            destructiveAction
            text='После завершения сбора снова открыть его не получится, придётся создавать новый.'
            header='Завершить сбор?'
            action={async () => {
                await updateTask({ taskId: collectionId, payload: payloadCloseTask });
                setSnackbarText({ type: 'success', text: 'Сбор завершен' });
            }}
            actionText='Завершить сбор'
            setPopout={setPopout}
        />
    );

    const popoutDeleteMember = (fullName: string, vkUserId: number): JSX.Element => (
        <Popout
            text={`Вы уверены, что хотите удалить пользователя ${fullName} ?`}
            header='Удалить пользователя'
            action={async () => {
                await deleteMember({ taskId: currentTask?.id, vkUserIds: [vkUserId] });
                setSnackbarText({ type: 'success', text: `Участник сбора ${fullName} удален` });
            }}
            actionText='Удалить'
            setPopout={setPopout}
        />
    );

    const popoutForbiddenFiles = (
        <Popout
            text='Этот архив может содержать потенциально опасные файлы, вы уверены что хотите скачать его?'
            header='Предупреждение'
            action={() => {
                downloadFiles({ taskId: collectionId });
            }}
            actionText='Скачать'
            setPopout={setPopout}
        />
    );

    const isForbiddenAllFiles = taskResults.some(({ content }) =>
        content.some((el) => isForbiddenFile(el.title)),
    );

    const removeMemberHandler = (fullName: string, vkUserId: number) => {
        setPopout(popoutDeleteMember(fullName, vkUserId));
    };

    const prepareButtonsOptions = (): ButtonOption[] => {
        const downloadAllButton: ButtonOption = {
            text: 'Скачать все файлы',
            onClick: () => {
                if (isForbiddenAllFiles) {
                    setPopout(popoutForbiddenFiles);
                } else {
                    downloadFiles({ taskId: collectionId });
                }
            },
            loading: isFileDownloading,
            mode: 'primary',
        };
        const closeTaskButton: ButtonOption = {
            text: 'Завершить сбор',
            onClick: () => handleUpdateTask(),
            loading: isTaskUpdating,
            mode: 'primary',
            appearance: 'negative',
        };

        const closedTask: ButtonOption = {
            text: 'Сбор завершён',
            onClick: () => {},
            loading: false,
            disabled: true,
            mode: 'primary',
            appearance: 'negative',
        };

        const buttonOptions = [];

        if (
            normalizedTestees.completed.length > 0 &&
            !isMobileDownloading &&
            !isDesktopDownloading
        ) {
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

    useEffect(() => {
        if (selectedTab) {
            setSnackbarText(null);
        }
    }, [selectedTab]);

    useEffect(() => {
        if (selectedTab) {
            refetchTaskResults();
            refetchTask();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab]);

    useLayoutEffect(() => {
        setFixLayoutHeight(fixedLayoutRef?.current?.firstChild?.offsetHeight);
    }, [selectedTab, isTaskClosed, fixedLayoutRef]);

    if (error && 'status' in error) {
        const errorMessage = errorParser(error.status as number);

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
                                {isTaskClosed ? 'Завершённый сбор' : 'Активный сбор'}
                            </PanelHeaderContent>
                        ) : (
                            <PanelHeaderSkeleton />
                        )}
                    </PanelHeader>

                    {currentTask.description && (
                        <MiniInfoCell
                            before={<Icon20FolderOutline />}
                            textWrap='full'
                            mode='base'
                        >
                            {currentTask.description}
                        </MiniInfoCell>
                    )}

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
                            currentTask={currentTask}
                            reminds={reminds}
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
                                        isTaskClosed={isTaskClosed}
                                        taskResults={normalizedTestees.completed}
                                        isMobileDownloading={isMobileDownloading}
                                        isDesktopDownloading={isDesktopDownloading}
                                        removeMemberHandler={removeMemberHandler}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {normalizedTestees.notCompleted.length > 0 && (
                                    <NotCompletedMembers
                                        setSnackbarText={setSnackbarText}
                                        isTaskClosed={isTaskClosed}
                                        collectionId={collectionId}
                                        taskResults={normalizedTestees.notCompleted}
                                        apiMessageError={apiMessageError}
                                        removeMemberHandler={removeMemberHandler}
                                        currentTask={currentTask}
                                        reminds={reminds}
                                    />
                                )}

                                {normalizedTestees.notCompleted.length === 0 && !isTaskClosed && (
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
