import { useRouter } from '@happysanta/router';
import { Panel, PanelHeaderBack } from '@vkontakte/vkui';
import type { FC } from 'react';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import Avatar1 from '@/assets/avatar1.svg';
import Avatar2 from '@/assets/avatar2.svg';
import { PANEL_COLLECTION_ID } from '@/app/router';

import { SentList } from './components/list';
import { ShareLink } from './components/share';

const sentListMock = [
    { id: 1, name: 'Алексей Чайников', icon: Avatar1 },
    { id: 2, name: 'Иван Черный', icon: Avatar2 },
];

export const CollectionIdPage: FC = () => {
    const router = useRouter();

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

            {sentListMock ? <SentList sentListMock={sentListMock} /> : <ShareLink />}
        </Panel>
    );
};
