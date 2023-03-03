import { useParams, useRouter } from '@happysanta/router';
import { Panel, PanelHeaderBack, Search, Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import { Icon28CheckCircleOutline } from '@vkontakte/icons';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskResultsQuery } from '@/api';

import { SentList } from './components/list';
import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';
import { useCopyToClipboard } from './hooks/useClipboardLink';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { data } = useGetTaskResultsQuery({ taskId: Number(collectionId) });

    const goBack = () => {
        router.popPage();
    };

    const [snackbar, setSnackbar] = useState('');

    const { copy, text } = useCopyToClipboard(collectionId);

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                Документы в лагерь
            </PanelHeaderCentered>

            <Search />

            {data?.taskResults.length ? (
                <SentList
                    collectionId={collectionId}
                    clipboardLink={copy}
                    collection={data?.taskResults}
                />
            ) : (
                <ShareLink clipboardLink={copy} />
            )}

            {text && (
                <Snackbar
                    before={<Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />}
                    onClose={() => setSnackbar('')}
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
