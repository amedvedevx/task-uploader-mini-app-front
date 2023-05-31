import { Panel, Group, Separator, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from '@happysanta/router';
import styled from 'styled-components';

import { PANEL_UPLOAD_ID } from '@/app/router';
import { useGetTaskIdQuery, useUploadFileMutation, useGetTaskResultsQuery } from '@/api';
import type { SnackBarText } from '@/app/types';
import { AddResultStatusTypes, TaskStatusTypesForOrganizer } from '@/app/types';
import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { SnackBarMessage } from '@/components/SnackBarMessage';
import { errorParser } from '@/lib/utils';

import { DropZone } from './components/DropZone';
import { FilesReadyToUpload } from './components/FilesReadyToUpload';
import { UploadPageActions } from './components/UploadPageActions';
import { TaskDescription } from './components/TaskDescription';
import { UploadedFiles } from './components/UploadedFiles';

interface ListMembersPageProps {
    id?: string;
}

export const UploadPage: FC<ListMembersPageProps> = () => {
    const { uploadId } = useParams();

    const { data, error } = useGetTaskIdQuery({ taskId: uploadId });
    const { data: taskResults } = useGetTaskResultsQuery({
        taskId: uploadId,
    });
    const taskId = uploadId;
    const subTaskId = data?.subTasks[0]?.id as string;
    const isTaskComplete = data?.status === TaskStatusTypesForOrganizer.DONE;
    const [uploadFile, statusFromServer] = useUploadFileMutation();

    const [isLoading, setLoading] = useState(false);

    const [files, setFiles] = useState<File[]>([]);
    const uploadedFiles = taskResults?.taskResults?.[0]?.subTaskResults?.[0]?.content;

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const removeFile = (lastModified: number) => {
        const filteredState = files.filter((file) => file.lastModified !== lastModified);
        setFiles(filteredState);
    };

    const removeSuccessFileFromStack = (fileName: string) => {
        setFiles((prevState) => {
            const newState = prevState.filter((file) => file.name !== fileName);

            return newState;
        });
    };

    const clearState = () => setFiles([]);

    const sendFiles = async () => {
        setLoading(true);

        for (const file of files) {
            await uploadFile({ taskId, subTaskId, file });
        }

        setLoading(false);
    };

    useEffect(() => {
        if (
            statusFromServer.data?.status === AddResultStatusTypes.NOT_LOADED ||
            statusFromServer.isError
        ) {
            setSnackbarText({
                type: 'error',
                text: `Загрузка файла ${
                    statusFromServer?.originalArgs?.file?.name || ''
                } не удалась`,
            });
        }

        if (statusFromServer.isSuccess) {
            const fileName = statusFromServer.originalArgs?.file?.name || '';

            setSnackbarText({
                type: 'success',
                text: `Файл ${statusFromServer?.originalArgs?.file?.name || ''} загружен`,
                fileName,
            });

            if (fileName) {
                removeSuccessFileFromStack(fileName);
            }
        }
    }, [statusFromServer]);

    if (error && 'status' in error) {
        const errorMessage = errorParser(error.status as number);

        throw Error(errorMessage);
    }

    return (
        <Panel
            id={PANEL_UPLOAD_ID}
            data-automation-id='upload-page-panel'
        >
            <PanelHeader>
                {data ? (
                    <PanelHeaderContent
                        data-automation-id='upload-page-headerContent'
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

            {uploadedFiles && <UploadedFiles files={uploadedFiles} />}

            <UploadPageWrapper>
                {!!files.length && (
                    <FilesReadyToUpload
                        files={files}
                        removeFile={removeFile}
                    />
                )}

                <DropZone
                    isTaskComplete={isTaskComplete}
                    isLoading={isLoading}
                    setFiles={setFiles}
                    setSnackbarText={setSnackbarText}
                />

                {!!files.length && (
                    <Group
                        separator='hide'
                        data-automation-id='upload-page-filesGroup'
                    >
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
                        data-automation-id='upload-page-snackBarMessage'
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
