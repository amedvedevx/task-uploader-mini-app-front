import { useParams, useRouter } from '@happysanta/router';
import {
    Avatar,
    ButtonGroup,
    CellButton,
    FixedLayout,
    Panel,
    PanelHeaderBack,
    Search,
    Separator,
    Snackbar,
    Spacing,
    Spinner,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
    Icon24DownloadOutline,
    Icon24CopyOutline,
    Icon28CheckCircleOutline,
} from '@vkontakte/icons';

import { PanelHeaderCentered, PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetTaskResultsQuery, useLazyDownloadFilesQuery } from '@/api';
import type { TaskType } from '@/app/types';
import { TaskStatusTypesForOrganizer } from '@/app/types';
import { FallbackComponent } from '@/app/FallbackComponent';

import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard, useSearch } from './hooks';
import { CollectionMembers } from './components/list';

const getHeaderTitle = (task: TaskType) => {
    if (task.status === TaskStatusTypesForOrganizer.DONE) {
        return 'Сбор завершен';
    }

    if (task.name) {
        return task.name;
    }

    return <PanelHeaderSkeleton />;
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

    const [isCompleteCollection, setIsCompleteCollection] = useState(false);

    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({ taskId: collectionId });

    const [title, setTitle] = useState<string | JSX.Element>('');

    useEffect(() => {
        if (currentTask.status === TaskStatusTypesForOrganizer.DONE) {
            setIsCompleteCollection(true);
        }

        setTitle(() => getHeaderTitle(currentTask));
    }, [currentTask]);

    const [downloadFiles, { isFetching }] = useLazyDownloadFilesQuery();

    const testees = taskResults.map((el) => el.testee);

    const { filteredData, search, changeSearch } = useSearch(testees, 'fullName');

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const { copyLink, text, setText } = useCopyToClipboard(collectionId);

    if (error?.status === 400) {
        const errorMessage = { name: 'wrong link', message: 'Такого сбора не существует' };

        return (
            <FallbackComponent
                error={errorMessage}
                resetErrorBoundary={false}
            />
        );
    }

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                {title}
            </PanelHeaderCentered>

            <FixedLayout
                filled
                vertical='top'
            >
                <Search
                    value={search}
                    onChange={changeSearch}
                />

                <Spacing size={2} />

                {!isLoading && (
                    <>
                        {taskResults.length > 0 && (
                            <>
                                <ButtonGroup
                                    stretched
                                    mode='vertical'
                                    gap='s'
                                >
                                    {!isCompleteCollection && (
                                        <CellButton
                                            disabled={isCompleteCollection}
                                            before={
                                                <Avatar
                                                    withBorder={false}
                                                    size={40}
                                                >
                                                    <Icon24CopyOutline />
                                                </Avatar>
                                            }
                                            onClick={() => copyLink()}
                                        >
                                            Скопировать ссылку на сбор
                                        </CellButton>
                                    )}

                                    <CellButton
                                        before={
                                            <Avatar
                                                withBorder={false}
                                                size={40}
                                            >
                                                <Icon24DownloadOutline />
                                            </Avatar>
                                        }
                                        after={isFetching && <Spinner />}
                                        disabled={isFetching || isCompleteCollection}
                                        onClick={() => downloadFiles({ taskId: collectionId })}
                                    >
                                        Скачать все файлы
                                    </CellButton>
                                </ButtonGroup>

                                <Spacing size={36}>
                                    <Separator />
                                </Spacing>
                            </>
                        )}
                    </>
                )}
            </FixedLayout>

            {!isLoading && (
                <>
                    {taskResults.length > 0 ? (
                        <CollectionMembers
                            isCompleteCollection={isCompleteCollection}
                            collectionId={collectionId}
                            collection={filteredData}
                        />
                    ) : (
                        <ShareLink shareLink={copyLink} />
                    )}
                </>
            )}

            {text && (
                <Snackbar
                    before={<Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />}
                    onClose={() => setText('')}
                >
                    {text}
                </Snackbar>
            )}

            {!isCompleteCollection && (
                <FooterWithButton
                    isCompleteCollection={isCompleteCollection}
                    collectionId={collectionId}
                    text='Завершить сбор'
                />
            )}
        </Panel>
    );
};
