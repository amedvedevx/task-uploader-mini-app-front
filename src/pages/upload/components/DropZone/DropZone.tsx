/* eslint-disable react/jsx-props-no-spreading */
import { Icon28CheckCircleOutline, Icon56DocumentOutline } from '@vkontakte/icons';
import { Div, Placeholder, File, Group, Separator, Spinner, Snackbar } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { useUploadFilesMutation } from '@/api/query/filesSlice';

import { UploadedFiles } from './components/UploadedFiles';
import { UploadPageActions } from './components/UploadPageActions';

interface DropZoneProps {
    taskId: number;
    subTaskId: number;
}

// 200 MB
const maxFileSize = 209715200;

export const DropZone: FC<DropZoneProps> = ({ taskId, subTaskId }) => {
    const [files, setFiles] = useState<File[]>([]);

    const [uploadFiles, status] = useUploadFilesMutation();

    const [snackbar, setSnackbar] = useState(false);

    const onDrop = useCallback((acceptedFile: File[]) => {
        setFiles((prevState) => [...prevState, ...acceptedFile]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } =
        useDropzone({ onDrop, maxSize: maxFileSize });

    const removeFile = (lastModified: number) => {
        const filteredState = files.filter((file) => file.lastModified !== lastModified);
        setFiles(filteredState);
    };

    const clearState = () => setFiles([]);

    const sendFiles = () => {
        const filesToSend = new FormData();
        files.forEach((file) => filesToSend.append('files', file));

        uploadFiles({ taskId, subTaskId, files: filesToSend });
    };

    useEffect(() => {
        setSnackbar(status.isSuccess);
    }, [status.isSuccess]);

    return (
        <DropZoneWrapper>
            <DivStretched>
                <DropZoneContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input
                        type='file'
                        {...getInputProps()}
                        disabled={status.isLoading}
                    />

                    {status.isLoading ? (
                        <Spinner size='large' />
                    ) : (
                        <PlaceholderCentered
                            icon={<Icon56DocumentOutline color='var(--vkui--color_icon_accent)' />}
                            action={!isDragActive && <File>Выбрать файл</File>}
                        >
                            Для загрузки файла перенесите его в эту область
                        </PlaceholderCentered>
                    )}
                </DropZoneContainer>
            </DivStretched>

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
                        isLoading={status.isLoading}
                    />
                </Group>
            )}

            {/* TODO ME-38134 - needed to show upload files status from vk server */}
            {snackbar && (
                <Snackbar
                    before={
                        <Icon28CheckCircleOutline
                            color='var(--vkui--color_text_positive)'
                            width={24}
                            height={24}
                        />
                    }
                    onClose={() => setSnackbar(false)}
                >
                    Файлы загружены
                </Snackbar>
            )}
        </DropZoneWrapper>
    );
};

interface DropZoneColors {
    isDragAccept: boolean;
    isDragReject: boolean;
    isFocused: boolean;
}

const getColor = ({ isDragAccept, isDragReject, isFocused }: DropZoneColors) => {
    if (isDragAccept) {
        return 'var(--vkui--color_stroke_accent)';
    }

    if (isDragReject) {
        return 'var(--vkui--color_stroke_negative)';
    }

    if (isFocused) {
        return 'var(--vkui--color_stroke_accent)';
    }

    return '#DCE1E6';
};

const DropZoneWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const DivStretched = styled(Div)`
    display: flex;
    flex-grow: 1;
`;

const DropZoneContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;

    padding: 20px;

    border-width: 2px;
    border-radius: 8px;
    border-color: ${(props) => getColor(props)};
    border-style: dashed;

    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;

    &:hover {
        border-color: var(--vkui--color_stroke_accent);
    }
`;

const PlaceholderCentered = styled(Placeholder)`
    height: 100%;
`;
