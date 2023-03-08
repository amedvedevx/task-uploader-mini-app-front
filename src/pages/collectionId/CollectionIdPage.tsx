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
import { Icon24DownloadOutline, Icon24Linked, Icon28CheckCircleOutline } from '@vkontakte/icons';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetTaskResultsQuery } from '@/api';

import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard, useDownloadFile, useSearch } from './hooks';
import { CollectionMembers } from './components/list/components/CollectionMembers';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { data } = useGetTaskResultsQuery({
        taskId: Number(collectionId),
    });

    const { data: currentTask } = useGetTaskIdQuery({ taskId: Number(collectionId) });

    const { download } = useDownloadFile(collectionId);

    const testee = data?.taskResults.map((el) => el.testee);

    const { filteredData, search, changeSearch } = useSearch(testee, 'firstName');

    const goBack = () => {
        router.popPage();
    };

    const { copyLink, text, setText } = useCopyToClipboard(collectionId);

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                {currentTask?.name}
            </PanelHeaderCentered>

            <FixedLayout
                filled
                vertical='top'
            >
                <Search
                    value={search}
                    onChange={changeSearch}
                />

                {!!data?.taskResults.length && (
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
            </FixedLayout>

            {data?.taskResults.length ? (
                <CollectionMembers
                    collectionId={collectionId}
                    collection={filteredData}
                />
            ) : (
                <ShareLink shareLink={copyLink} />
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
