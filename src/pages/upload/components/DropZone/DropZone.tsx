/* eslint-disable react/jsx-props-no-spreading */
import { Icon56DocumentOutline } from '@vkontakte/icons';
import { Div, Placeholder, File, Group, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { UploadedFiles } from './components/UploadedFiles';
import { UploadPageActions } from './components/UploadPageActions';

// 200 MB
const maxFileSize = 209715200;

export const DropZone: FC = () => {
    const [files, setFiles] = useState<File[]>([]);

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
        // eslint-disable-next-line no-console
        console.log('SendFiles to Backend');
    };

    return (
        <DropZoneWrapper>
            <DivStretched>
                <DropZoneContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />

                    <PlaceholderCentered
                        icon={<Icon56DocumentOutline color='var(--vkui--color_icon_accent)' />}
                        action={!isDragActive && <File>Выбрать файл</File>}
                    >
                        Для загрузки файла перенесите его в эту область
                    </PlaceholderCentered>
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
                    />
                </Group>
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
