import { Panel, PanelHeaderClose, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useParams, useRouter } from '@happysanta/router';

import { PANEL_UPLOAD_ID } from '@/app/router';
import { useGetTaskIdQuery } from '@/api';

import { DropZone } from './components/DropZone/DropZone';

export const UploadPage: FC = () => {
    const router = useRouter();
    const { uploadId } = useParams();

    const { data } = useGetTaskIdQuery({ taskId: Number(uploadId) });

    return (
        <Panel id={PANEL_UPLOAD_ID}>
            <PanelHeader before={<PanelHeaderClose onClick={() => router.popPage()} />}>
                <PanelHeaderContent
                    status={`запрашивает ${data?.owner.firstName} ${data?.owner.lastName}`}
                >
                    {data?.name}
                </PanelHeaderContent>
            </PanelHeader>

            <DropZone
                taskId={data?.id}
                subTaskId={data?.subTasks[0].id}
            />
        </Panel>
    );
};
