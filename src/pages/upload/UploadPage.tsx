import { Panel, Group, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from '@happysanta/router';
import styled from 'styled-components';

import { PANEL_UPLOAD_ID } from '@/app/router';
import {
    useGetTaskIdQuery,
    useUploadFileMutation,
    useGetTaskResultsQuery,
    useGetPlatformQuery,
} from '@/api';
import type { SnackBarText } from '@/app/types';
import { AddResultStatusTypes, TaskStatusTypesForOrganizer } from '@/app/types';
import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { SnackBarMessage } from '@/components/SnackBarMessage';
import { checkIsMobilePlatform, errorParser } from '@/lib/utils';
import { FooterWithButton } from '@/components';

import { DropZone } from './components/DropZone';
import { FilesReadyToUpload } from './components/FilesReadyToUpload';
import { TaskDescription } from './components/TaskDescription';

interface ListMembersPageProps {
    id?: string;
}

export const UploadPage: FC<ListMembersPageProps> = () => {
    const {
        route: {
            params: { uploadId },
        },
    } = useLocation();

    const { data: platform = '' } = useGetPlatformQuery();
    const { data, error } = useGetTaskIdQuery({ taskId: uploadId }, { skip: !uploadId });
    const { data: taskResults } = useGetTaskResultsQuery({ taskId: uploadId }, { skip: !uploadId });

    const isMobilePlatform = checkIsMobilePlatform(platform);

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

    const sendFiles = async () => {
        setLoading(true);

        const fileStatuses = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            await uploadFile({ taskId, subTaskId, file }).then((res) => {
                fileStatuses.push(res);
            });
        }

        setLoading(false);
    };

    const handleSendFiles = async () => {
        await sendFiles();

        if (statusFromServer.data?.status === AddResultStatusTypes.NOT_LOADED) {
            if (tries <= 3) {
                await sendFiles();
                setTries((prev) => prev + 1);
            } else {
                setSnackbarText({
                    type: 'error',
                    text: 'Возникли проблемы при загрузке, попробуйте позже',
                });
            }
        }
    };

    const getFileStatus = (uploadDate: string) => {
        if (uploadDate) {
            return 'success';
        }

        if (isLoading && !uploadDate) {
            if (statusFromServer.isSuccess) {
                return 'success';
            }

            return 'loading';
        }

        return 'delete';
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
                        ? `: ${
                              statusFromServer.error?.data?.message
                                  ? statusFromServer.error.data.message
                                  : statusFromServer.error
                          }`
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
                    isMobilePlatform={isMobilePlatform}
                    isTaskComplete={isTaskComplete}
                    isLoading={isLoading}
                    setFiles={setFiles}
                    setSnackbarText={setSnackbarText}
                />

                {(!!files.length || !!uploadedFiles?.length) && (
                    <Group
                        separator='hide'
                        data-automation-id='upload-page-filesGroup'
                    >
                        <FilesReadyToUpload
                            files={files}
                            uploadedFiles={uploadedFiles}
                            getFileStatus={getFileStatus}
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

                {!!files.length && (
                    <FooterWithButton
                        options={[
                            {
                                text: 'Отправить',
                                onClick: () => handleSendFiles(),
                                disabled: isLoading,
                                mode: 'primary',
                                appearance: 'accent',
                                dataAutomationId: 'upload-page-sendFilesButton',
                            },
                        ]}
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

    padding-bottom: 52px;
`;
