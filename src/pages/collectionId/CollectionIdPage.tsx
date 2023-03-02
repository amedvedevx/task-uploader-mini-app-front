import { useParams, useRouter } from '@happysanta/router';
import { Panel, PanelHeaderBack, Search } from '@vkontakte/vkui';
import type { FC } from 'react';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_ID } from '@/app/router';
import { useGetTaskResultsQuery } from '@/api';

import { SentList } from './components/list';
import { ShareLink } from './components/share';
import { FooterWithButton } from '../components';

export const CollectionIdPage: FC = () => {
    const router = useRouter();
    const { collectionId } = useParams();

    const { data } = useGetTaskResultsQuery({ taskId: Number(collectionId) });

    const goBack = () => {
        router.popPage();
    };

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
                <SentList collection={data?.taskResults} />
            ) : (
                <ShareLink collectionId={collectionId} />
            )}

            <FooterWithButton
                collectionId={collectionId}
                text='Завершить сбор'
            />
        </Panel>
    );
};
