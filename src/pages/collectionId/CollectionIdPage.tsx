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
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Icon24DownloadOutline, Icon24Linked, Icon28CheckCircleOutline } from '@vkontakte/icons';

import { PanelHeaderCentered, PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_HOME, PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetTaskResultsQuery } from '@/api';

import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard, useDownloadFile, useSearch } from './hooks';
import { CollectionMembers } from './components/list/components/CollectionMembers';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { data: taskResults, isLoading } = useGetTaskResultsQuery({
        taskId: Number(collectionId),
    });

    const { data: currentTask } = useGetTaskIdQuery({ taskId: Number(collectionId) });

    const { download } = useDownloadFile(collectionId);

    const testees = taskResults?.taskResults.map((el) => el.testee);

    const { filteredData, search, changeSearch } = useSearch(testees, 'firstName');

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
                        {taskResults?.taskResults?.length > 0 && (
                            <>
                                <ButtonGroup
                                    mode='vertical'
                                    gap='s'
                                >
                                    <CellButton
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
                                        onClick={() => download()}
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
                    {taskResults?.taskResults?.length > 0 ? (
                        <CollectionMembers
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
                collectionId={collectionId}
                text='Завершить сбор'
            />
        </Panel>
    );
};
