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
import { Icon24DownloadOutline, Icon24Linked, Icon28CheckCircleOutline } from '@vkontakte/icons';

import { PanelHeaderCentered, PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetTaskResultsQuery, useLazyDownloadFilesQuery } from '@/api';
import { TaskStatusTypesForOrganizer } from '@/app/types';

import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard, useSearch } from './hooks';
import { CollectionMembers } from './components/list';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { data = { taskResults: [] }, isLoading } = useGetTaskResultsQuery({
        taskId: collectionId,
    });

    const { taskResults } = data;

    const [isCompleteCollection, setIsCompleteCollection] = useState(false);

    const { data: currentTask } = useGetTaskIdQuery({ taskId: collectionId });

    useEffect(() => {
        if (currentTask?.status === TaskStatusTypesForOrganizer.DONE) {
            setIsCompleteCollection(true);
        }
    }, [currentTask?.status]);

    const [downloadFiles, { isFetching }] = useLazyDownloadFilesQuery();

    const testees = taskResults.map((el) => el.testee);

    const { filteredData, search, changeSearch } = useSearch(testees, 'fullName');

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    const { copyLink, text, setText } = useCopyToClipboard(collectionId);

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                {currentTask ? currentTask.name : <PanelHeaderSkeleton />}
            </PanelHeaderCentered>

            <FixedLayout
                filled
                vertical='top'
            >
                <Search
                    value={search}
                    onChange={changeSearch}
                />

                {!isLoading && (
                    <>
                        {taskResults.length > 0 && (
                            <>
                                <ButtonGroup
                                    stretched
                                    mode='vertical'
                                    gap='s'
                                >
                                    <CellButton
                                        disabled={isCompleteCollection}
                                        before={
                                            <Avatar
                                                withBorder={false}
                                                size={40}
                                            >
                                                <Icon24Linked />
                                            </Avatar>
                                        }
                                        onClick={() => copyLink()}
                                    >
                                        Поделиться ссылкой на сбор
                                    </CellButton>

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

            <FooterWithButton
                isCompleteCollection={isCompleteCollection}
                collectionId={collectionId}
                text='Завершить сбор'
            />
        </Panel>
    );
};
