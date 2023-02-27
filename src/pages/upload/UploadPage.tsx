import { Panel, PanelHeaderClose, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useRouter } from '@happysanta/router';

import { PANEL_UPLOAD_ID } from '@/app/router';

import { DropZone } from './components/DropZone/DropZone';

const uploadMock = {
    name: 'Документы в лагерь',
    creatorName: 'Анна Круглова',
};

export const UploadPage: FC = () => {
    const router = useRouter();

    return (
        <Panel id={PANEL_UPLOAD_ID}>
            <PanelHeader before={<PanelHeaderClose onClick={() => router.popPage()} />}>
                <PanelHeaderContent status={`запрашивает ${uploadMock.creatorName}`}>
                    {uploadMock.name}
                </PanelHeaderContent>
            </PanelHeader>

            <DropZone />
        </Panel>
    );
};
