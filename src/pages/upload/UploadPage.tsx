import { Panel, Group, Separator, Spacing, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from '@happysanta/router';
import styled from 'styled-components';

import { PANEL_UPLOAD_ID } from '@/app/router';
import { useGetTaskIdQuery, useGetSubTaskResultStatusQuery, useUploadFilesMutation } from '@/api';
import type { SnackBarText } from '@/app/types';
import { AddResultStatusTypes, TaskStatusTypesForOrganizer } from '@/app/types';
import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { SnackBarMessage } from '@/components/SnackBarMessage';
import { errorParser } from '@/lib/utils';

import { DropZone } from './components/DropZone';
import { UploadedFiles } from './components/UploadedFiles';
import { UploadPageActions } from './components/UploadPageActions';
import { TaskDescription } from './components/TaskDescription';

export const UploadPage: FC = () => {
    const { uploadId } = useParams();

    const { data, error } = useGetTaskIdQuery({ taskId: uploadId });
    const taskId = uploadId;
    const subTaskId = data?.subTasks[0]?.id as string;
    const isTaskComplete = data?.status === TaskStatusTypesForOrganizer.DONE;
    const [uploadFiles, statusFromServer] = useUploadFilesMutation();

    const [isLoading, setLoading] = useState(false);
    const [isUploading, setUploading] = useState(false);

    const { currentData: statusFromVk } = useGetSubTaskResultStatusQuery(
        {
            taskId,
            subTaskId,
        },
        { skip: !isUploading, pollingInterval: 5000 },
    );

    const [files, setFiles] = useState<File[]>([]);

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

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

    const finalizeUpload = (result: SnackBarText) => {
        setLoading(false);
        setSnackbarText(result);
        setUploading(false);

        if (result?.type === 'success') clearState();
    };

    useEffect(() => {
        const errorMessage = statusFromVk?.exception;

        if (statusFromVk?.isError) {
            finalizeUpload({
                type: 'error',
                text: errorMessage || 'Загрузка файлов не удалась',
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
                    text: errorMessage || 'Загрузка файлов не удалась',
                });
                break;
            case AddResultStatusTypes.LOADED:
                finalizeUpload({ type: 'success', text: 'Файлы загружены' });
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
            finalizeUpload({ type: 'error', text: 'Загрузка файлов не удалась' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFromServer]);

    if (error?.status) {
        const errorMessage = errorParser(error?.status);

        throw Error(errorMessage);
    }

    return (
        <Panel id={PANEL_UPLOAD_ID}>
            <PanelHeader>
                {data ? (
                    <PanelHeaderContent
                        status={`запрашивает ${data?.owner.firstName} ${data?.owner.lastName}`}
                    >
                        Сбор документов
                    </PanelHeaderContent>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeader>

            <TaskDescription
                taskName={data?.name}
                description={data?.description}
            />

            <UploadPageWrapper>
                <DropZone
                    isTaskComplete={isTaskComplete}
                    isLoading={isLoading}
                    setFiles={setFiles}
                    setSnackbarText={setSnackbarText}
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

                {snackbarText && (
                    <SnackBarMessage
                        snackbarText={snackbarText}
                        setSnackbarText={setSnackbarText}
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
    overflow-x: hidden;
`;
