import { useParams, useRouter } from '@happysanta/router';
import { Panel, PanelHeaderBack, Search, Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { Icon28CheckCircleOutline } from '@vkontakte/icons';
import { useSelector } from 'react-redux';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_ID } from '@/app/router';
import type { RootState } from '@/api';
import { useGetTaskResultsQuery } from '@/api';

import { SentList } from './components/list';
import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard } from './hooks/useClipboardLink';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { collectionHeader } = useSelector((state: RootState) => state.layout);

    const { data } = useGetTaskResultsQuery({ taskId: Number(collectionId) });

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
                {collectionHeader}
            </PanelHeaderCentered>

            <Search />

            {data?.taskResults.length ? (
                <SentList
                    collectionId={collectionId}
                    shareLink={copyLink}
                    collection={data.taskResults}
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
