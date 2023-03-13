import { Panel, PanelHeaderContent, Group, Separator, Spacing } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from '@happysanta/router';
import styled from 'styled-components';

import { PANEL_UPLOAD_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetSubTaskResultStatusQuery, useUploadFilesMutation } from '@/api';
import { AddResultStatusTypes } from '@/app/types';
import { PanelHeaderCentered, PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { FallbackComponent } from '@/app/FallbackComponent';

import { DropZone } from './components/DropZone';
import { UploadedFiles } from './components/UploadedFiles';
import { UploadPageActions } from './components/UploadPageActions';
import { UploadResultMessage } from './components/UploadResultMessage';

export type SnackBarType = {
    type: 'error' | 'success' | false;
    message: string;
};

export const UploadPage: FC = () => {
    const { uploadId } = useParams();

    const { data, error } = useGetTaskIdQuery({ taskId: uploadId });
    const [uploadFiles, statusFromServer] = useUploadFilesMutation();

    const [isLoading, setLoading] = useState(false);
    const [isUploading, setUploading] = useState(false);
    const taskId = data?.id;
    const subTaskId = data?.subTasks[0].id;

    const { currentData: statusFromVk } = useGetSubTaskResultStatusQuery(
        {
            taskId: uploadId,
            subTaskId: data?.subTasks[0].id,
        },
        { skip: !isUploading, pollingInterval: 5000 },
    );

    const [files, setFiles] = useState<File[]>([]);

    const [snackbar, setSnackbar] = useState<SnackBarType>({ type: false, message: '' });

    const removeFile = (lastModified: number) => {
        const filteredState = files.filter((file) => file.lastModified !== lastModified);
        setFiles(filteredState);
    };

    const clearState = () => setFiles([]);

    const sendFiles = () => {
        const filesToSend = new FormData();
        files.forEach((file) => filesToSend.append('files', file));
        setLoading(true);
        uploadFiles({ taskId, subTaskId, files: filesToSend }).then(() => {
            setUploading(true);
        });
    };

    const finalizeUpload = (result: SnackBarType) => {
        setLoading(false);
        setSnackbar(result);
        setUploading(false);

        if (result.type === 'success') clearState();
    };

    useEffect(() => {
        const errorMessage = statusFromVk?.exception;

        if (statusFromVk?.isError) {
            finalizeUpload({
                type: 'error',
                message: errorMessage || 'Загрузка файлов не удалась',
            });

            return;
        }
        switch (statusFromVk?.status) {
            case AddResultStatusTypes.IN_PROGRESS:
                setLoading(true);
                break;
            case AddResultStatusTypes.NOT_LOADED:
                finalizeUpload({
                    type: 'error',
                    message: errorMessage || 'Загрузка файлов не удалась',
                });
                break;
            case AddResultStatusTypes.LOADED:
                finalizeUpload({ type: 'success', message: 'Файлы загружены' });
                break;

            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFromVk]);

    useEffect(() => {
        if (
            statusFromServer.data?.status === AddResultStatusTypes.NOT_LOADED ||
            statusFromServer.isError
        ) {
            finalizeUpload({ type: 'error', message: 'Загрузка файлов не удалась' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFromServer]);

    if (error?.status === 400) {
        const errorMessage = { name: 'wrong link', message: 'Такого сбора не существует' };

        return (
            <FallbackComponent
                error={errorMessage}
                resetErrorBoundary={false}
            />
        );
    }

    return (
        <Panel id={PANEL_UPLOAD_ID}>
            <PanelHeaderCentered>
                {data ? (
                    <PanelHeaderContentCentered
                        status={`запрашивает ${data?.owner.firstName} ${data?.owner.lastName}`}
                    >
                        {data?.name}
                    </PanelHeaderContentCentered>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeaderCentered>

            <UploadPageWrapper>
                <DropZone
                    isLoading={isLoading}
                    setFiles={setFiles}
                    setSnackbar={setSnackbar}
                />

                {!!files.length && (
                    <Group separator='hide'>
                        <UploadedFiles
                            files={files}
                            removeFile={removeFile}
                        />

                        <Spacing size={24} />

                        <Separator wide />

                        <UploadPageActions
                            clearState={clearState}
                            sendFiles={sendFiles}
                            isLoading={isLoading}
                        />
                    </Group>
                )}

                {snackbar.type && (
                    <UploadResultMessage
                        result={snackbar}
                        setSnackbar={setSnackbar}
                    />
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

const PanelHeaderContentCentered = styled(PanelHeaderContent)`
    .vkuiPanelHeaderContent__in {
        align-items: center;
    }
`;
