import { Panel, Group, PanelHeader, PanelHeaderContent, MiniInfoCell, Div } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@happysanta/router';
import styled from 'styled-components';
import { Icon20Info } from '@vkontakte/icons';
import { useSelector } from 'react-redux';

import { PANEL_UPLOAD_ID } from '@/app/router';
import type { RootState } from '@/api';
import {
    useGetTaskIdQuery,
    useUploadFileMutation,
    useGetTaskResultsQuery,
    useGetPlatformQuery,
    useAppointUsersToTaskMutation,
} from '@/api';
import type { SnackBarText } from '@/app/types';
import { TaskStatusTypesForOrganizer } from '@/app/types';
import { PanelHeaderSkeleton } from '@/components/PanelHeaderCentered';
import { SnackBarMessage } from '@/components/SnackBarMessage';
import { checkIsMobilePlatform, errorParser, getUserIdFromBearer } from '@/lib/utils';
import { FooterWithButton } from '@/components';
import { useEduCheck } from '@/hooks';

import { DropZone } from './components/DropZone';
import { FilesReadyToUpload } from './components/FilesReadyToUpload';

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
    const { bearer } = useSelector((state: RootState) => state.authorization);
    const userId = getUserIdFromBearer(bearer);
    const [appointUsersToTask] = useAppointUsersToTaskMutation();
    const [uploadedWithErrors, setUploadedWithErrors] = useState<boolean>(false);

    const taskIsEdu = data?.owner?.isEdu;

    useEduCheck(taskIsEdu);

    const isMobilePlatform = checkIsMobilePlatform(platform);

    const taskId = uploadId;
    const isTaskComplete = data?.status === TaskStatusTypesForOrganizer.DONE;
    const [uploadFile, uploadResult] = useUploadFileMutation();

    const [isLoading, setLoading] = useState(false);
    const tries = useRef(0);
    const [files, setFiles] = useState<File[]>([]);
    const uploadedFiles = taskResults?.taskResults?.[0]?.content || [];

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const removeFile = (name: string) => {
        setFiles((prevState) => prevState.filter((file) => file.name !== name));
    };

    const sendFiles = useCallback(async () => {
        if (tries.current === 3) {
            setSnackbarText({
                type: 'error',
                text: 'Ошибка при загрузке файлов, повторите позже',
            });
            tries.current = 0;
            setUploadedWithErrors(false);

            return;
        }

        tries.current += 1;
        setUploadedWithErrors(false);
        setLoading(true);
        let hasErrors = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            const result = await uploadFile({ taskId, file });

            if ('error' in result && result.error) {
                const errorText = `Загрузка файла ${file?.name || ''} не удалась${
                    result.error !== 'error'
                        ? `: ${result.error?.data?.message || result.error}`
                        : '.'
                }`;
                setSnackbarText({
                    type: 'error',
                    text: errorText,
                });

                hasErrors = true;
            } else {
                removeFile(file.name);
            }
        }

        if (hasErrors) {
            setUploadedWithErrors(true);
        }

        setLoading(false);
    }, [files, taskId, uploadFile]);

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

    const AppointNewUserToTask = () => {
        const isUserAppointedToTask =
            (taskResults && taskResults?.taskResults?.length > 0) || false;

        if (!isUserAppointedToTask && userId) {
            const payload = {
                taskId: uploadId,
                vkUserIds: [userId],
            };

            appointUsersToTask({ payload });
        }
    };

    useEffect(() => {
        if (uploadedWithErrors) {
            setTimeout(() => {
                sendFiles();
            }, 1000);
        }
    }, [sendFiles, uploadedWithErrors]);

    useEffect(() => {
        if (uploadId && taskResults && userId && !isTaskComplete) AppointNewUserToTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadId, taskResults, userId, isTaskComplete]);

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
                        {data.name}
                    </PanelHeaderContent>
                ) : (
                    <PanelHeaderSkeleton />
                )}
            </PanelHeader>

            {data?.description && (
                <DescriptionWrapper>
                    <MiniInfoCell
                        before={<Icon20Info />}
                        textWrap='full'
                        mode='base'
                    >
                        {data.description}
                    </MiniInfoCell>
                </DescriptionWrapper>
            )}

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
                        isFooterOnPage
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

const DescriptionWrapper = styled(Div)`
    padding: 12px 5px 0px 5px;
`;
