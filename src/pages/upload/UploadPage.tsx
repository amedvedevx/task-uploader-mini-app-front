import { Panel, Group, PanelHeader, PanelHeaderContent } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const [uploadedWithErrors, setUploadedWithErrors] = useState<boolean>(false);

    const isMobilePlatform = checkIsMobilePlatform(platform);

    const taskId = uploadId;
    const subTaskId = data?.subTasks[0]?.id as string;
    const isTaskComplete = data?.status === TaskStatusTypesForOrganizer.DONE;
    const [uploadFile, uploadResult] = useUploadFileMutation();
    const { isSuccess, originalArgs } = uploadResult;

    const [isLoading, setLoading] = useState(false);
    const tries = useRef(0);
    const [files, setFiles] = useState<File[]>([]);
    const uploadedFiles = taskResults?.taskResults?.[0]?.subTaskResults?.[0]?.content;

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const removeFile = (lastModified: number) => {
        setFiles((prevState) => prevState.filter((file) => file.lastModified !== lastModified));
    };

    const removeSuccessFileFromStack = (fileName: string) => {
        setFiles((prevState) => prevState.filter((file) => file.name !== fileName));
    };

    const sendFiles = useCallback(async () => {
        if (tries.current === 3) {
            setSnackbarText({
                type: 'error',
                text: 'Ошибка при загрузке файлов, повторите позже',
            });

            return;
        }

        setUploadedWithErrors(false);

        tries.current += 1;

        setLoading(true);

        let hasErrors = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            const result = await uploadFile({ taskId, subTaskId, file });

            if (result.error) {
                const errorText = `Загрузка файла ${
                    result?.originalArgs?.file?.name || ''
                } не удалась${
                    result.error && result.error !== 'error'
                        ? `: ${
                            result.error?.data?.message ? result.error.data.message : result.error
                        }`
                        : '.'
                }`;
                setSnackbarText({
                    type: 'error',
                    text: errorText,
                });

                hasErrors = true;
            } else {
                const fileName = originalArgs?.file?.name || '';

                setSnackbarText({
                    type: 'success',
                    text: `Файл ${originalArgs?.file?.name || ''} загружен`,
                    fileName,
                });

                removeSuccessFileFromStack(fileName);
            }
        }

        if (hasErrors) {
            setUploadedWithErrors(true);
        }

        setLoading(false);
    }, [files, originalArgs?.file?.name, subTaskId, taskId, uploadFile]);

    /* const handleSendFiles = useCallback(async () => {
        await sendFiles();

        if (isError) {
            if (tries.current < 3) {
                // need to push here updated state
                await handleSendFiles();
            } else {
                setSnackbarText({
                    type: 'error',
                    text: 'Возникли проблемы при загрузке, попробуйте позже',
                });

                isError.current = false;
            }
        }
    }, [sendFiles]); */

    const getFileStatus = (uploadDate: string) => {
        if (uploadDate) {
            return 'success';
        }

        if (isLoading && !uploadDate) {
            if (uploadResult.isSuccess) {
                return 'success';
            }

            return 'loading';
        }

        return 'delete';
    };

    useEffect(() => {
        if (uploadedWithErrors) {
            void sendFiles();
        }
    }, [sendFiles, uploadedWithErrors]);

    /* useEffect(() => {
        if (uploadResult.data?.status === AddResultStatusTypes.NOT_LOADED || uploadResult.isError) {
            const errorText = `Загрузка файла ${
                uploadResult?.originalArgs?.file?.name || ''
            } не удалась${
                uploadResult.error && uploadResult.error !== 'error'
                    ? `: ${
                        uploadResult.error?.data?.message
                            ? uploadResult.error.data.message
                            : uploadResult.error
                    }`
                    : '.'
            }`;
            setSnackbarText({
                type: 'error',
                text: errorText,
            });
            isError.current = true;
        }
    }, [
        uploadResult.data,
        uploadResult.error,
        uploadResult.isError,
        uploadResult?.originalArgs?.file?.name,
    ]); */

    /* useEffect(() => {
        if (!isSuccess) {
            return;
        }

        const fileName = originalArgs?.file?.name || '';

        setSnackbarText({
            type: 'success',
            text: `Файл ${originalArgs?.file?.name || ''} загружен`,
            fileName,
        });

        if (fileName) {
            removeSuccessFileFromStack(fileName);
        }
    }, [isSuccess, originalArgs?.file?.name, originalArgs?.file]); */

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
                                onClick: sendFiles,
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
