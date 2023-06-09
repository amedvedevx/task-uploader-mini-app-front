import { Panel, Group, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
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
import { FooterWithButton, type ButtonOption } from '@/components';

import { DropZone } from './components/DropZone';
import { FilesReadyToUpload } from './components/FilesReadyToUpload';
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

    const [tries, setTries] = useState(0);
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

        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            await uploadFile({ taskId, subTaskId, file });

            if (statusFromServer.isError) {
                setTries((prev) => prev + 1);

                console.log(tries);

                if (tries <= 3) {
                    setTimeout(() => {
                        uploadFile({ taskId, subTaskId, file });
                    }, 500);
                } else {
                    setSnackbarText({
                        type: 'error',
                        text: 'Возникли проблемы при загрузке, попробуйте позже',
                    });
                }
            }
        }

        setLoading(false);
    };

    const prepareButtonsOptions = (): ButtonOption[] => {
        const sendFilesButton: ButtonOption = {
            text: 'Отправить',
            onClick: () => sendFiles(),
            disabled: isLoading,
            mode: 'primary',
            appearance: 'accent',
            dataAutomationId: 'upload-page-sendFilesButton',
        };
        const removeFilesButton: ButtonOption = {
            text: 'Отменить',
            onClick: () => clearState(),
            disabled: isLoading,
            mode: 'secondary',
            appearance: 'accent',
            dataAutomationId: 'upload-page-cancelButton',
        };

        return [removeFilesButton, sendFilesButton];
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
                } не удалась${
                    statusFromServer.error && statusFromServer.error !== 'error'
                        ? `: ${statusFromServer.error}`
                        : '.'
                }`,
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

            <UploadPageWrapper>
                <DropZone
                    isTaskComplete={isTaskComplete}
                    isLoading={isLoading}
                    setFiles={setFiles}
                    setSnackbarText={setSnackbarText}
                />

                {uploadedFiles && (
                    <Group
                        separator='hide'
                        data-automation-id='upload-page-filesGroup'
                    >
                        <UploadedFiles files={uploadedFiles} />
                    </Group>
                )}

                {!!files.length && (
                    <Group
                        separator='hide'
                        data-automation-id='upload-page-filesGroup'
                    >
                        <FilesReadyToUpload
                            files={files}
                            removeFile={removeFile}
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

                <FooterWithButton options={prepareButtonsOptions()} />
            </UploadPageWrapper>
        </Panel>
    );
};

const UploadPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;

    padding-bottom: 52px;
`;
