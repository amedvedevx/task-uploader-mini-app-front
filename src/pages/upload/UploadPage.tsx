import {
    Panel,
    PanelHeaderClose,
    PanelHeader,
    PanelHeaderContent,
    Group,
    Separator,
    Snackbar,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from '@happysanta/router';
import { Icon28CheckCircleOutline, Icon28CancelCircleFillRed } from '@vkontakte/icons';
import styled from 'styled-components';

import { PANEL_UPLOAD_ID } from '@/app/router';
import {
    useGetTaskIdQuery,
    useLazyGetSubTaskResultStatusQuery,
    useUploadFilesMutation,
} from '@/api';
import { AddResultStatusTypes } from '@/app/types';
import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';

import { DropZone } from './components/DropZone';
import { UploadedFiles } from './components/UploadedFiles';
import { UploadPageActions } from './components/UploadPageActions';

export const UploadPage: FC = () => {
    const router = useRouter();
    const { uploadId } = useParams();

    const { data } = useGetTaskIdQuery({ taskId: Number(uploadId) });
    const [uploadFiles, statusFromServer] = useUploadFilesMutation();
    const [subscribeUploadStatus, statusFromVk] = useLazyGetSubTaskResultStatusQuery({
        pollingInterval: 5000,
    });

    const taskId = Number(data?.id);
    const subTaskId = Number(data?.subTasks[0].id);

    const [files, setFiles] = useState<File[]>([]);

    const [snackbar, setSnackbar] = useState<string>('');
    const [isLoading, setLoading] = useState(false);

    const removeFile = (lastModified: number) => {
        const filteredState = files.filter((file) => file.lastModified !== lastModified);
        setFiles(filteredState);
    };

    const clearState = () => setFiles([]);

    const sendFiles = () => {
        const filesToSend = new FormData();
        files.forEach((file) => filesToSend.append('files', file));

        uploadFiles({ taskId, subTaskId, files: filesToSend });
        subscribeUploadStatus({ taskId, subTaskId });
        setLoading(true);
    };

    const finalizeUpload = (result: 'success' | 'error') => {
        setLoading(false);
        setSnackbar(result);
        subscribeUploadStatus({ taskId, subTaskId }).unsubscribe();

        if (result === 'success') clearState();
    };

    useEffect(() => {
        switch (statusFromVk.data?.status) {
            case AddResultStatusTypes.IN_PROGRESS:
                setLoading(true);
                break;
            case AddResultStatusTypes.NOT_LOADED:
                finalizeUpload('error');
                break;
            case AddResultStatusTypes.LOADED:
                finalizeUpload('success');
                break;

            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFromVk]);

    useEffect(() => {
        if (statusFromServer.data?.status === AddResultStatusTypes.NOT_LOADED) {
            finalizeUpload('error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFromServer.data?.status]);

    return (
        <Panel id={PANEL_UPLOAD_ID}>
            {data ? (
                <PanelHeader before={<PanelHeaderClose onClick={() => router.popPage()} />}>
                    <PanelHeaderContent
                        status={`запрашивает ${data?.owner.firstName} ${data?.owner.lastName}`}
                    >
                        {data?.name}
                    </PanelHeaderContent>
                </PanelHeader>
            ) : (
                <PanelHeaderSkeleton />
            )}

            <UploadPageWrapper>
                <DropZone
                    isLoading={isLoading}
                    setFiles={setFiles}
                />

                {!!files.length && (
                    <Group separator='hide'>
                        <UploadedFiles
                            files={files}
                            removeFile={removeFile}
                        />

                        <Separator wide />

                        <UploadPageActions
                            clearState={clearState}
                            sendFiles={sendFiles}
                            isLoading={isLoading}
                        />
                    </Group>
                )}

                {snackbar && (
                    <Snackbar
                        before={
                            snackbar === 'success' ? (
                                <Icon28CheckCircleOutline color='var(--vkui--color_text_positive)' />
                            ) : (
                                <Icon28CancelCircleFillRed />
                            )
                        }
                        onClose={() => setSnackbar('')}
                    >
                        {snackbar === 'success' ? 'Файлы загружены' : 'Загрузка файлов не удалась'}
                    </Snackbar>
                )}
            </UploadPageWrapper>
        </Panel>
    );
};

const UploadPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
