/* eslint-disable react/jsx-props-no-spreading */
import { Icon56CancelCircleOutline } from '@vkontakte/icons';
import { Div, Placeholder, File, Spinner } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import type { SnackBarText } from '@/app/types';

interface DropZoneProps {
    isLoading: boolean;
    isTaskComplete: boolean;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setSnackbarText: (arg: SnackBarText) => void;
}

// 200 MB
const maxFileSize = 209715200;
const rejectFileMessage = { code: 'reject', message: 'wrong-file' };

export const DropZone: FC<DropZoneProps> = ({
    isTaskComplete,
    isLoading,
    setFiles,
    setSnackbarText,
}) => {
    const filesValidator = (file: File) => {
        if (file.size > maxFileSize) {
            setSnackbarText({ type: 'error', text: 'Размер файла слишком большой' });

            return rejectFileMessage;
        }

        return null;
    };

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prevState) => {
            const newState = prevState.concat(acceptedFiles);
            const uniqueObjArray = [...new Map(newState.map((file) => [file.name, file])).values()];

            return uniqueObjArray;
        });
    };

    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } =
        useDropzone({ onDrop, validator: filesValidator });

    return (
        <DivStretched>
            {isTaskComplete ? (
                <DropZoneContainer isDisabled>
                    <PlaceholderCentered
                        data-automation-id='upload-page-placeholderCompleted'
                        icon={<Icon56CancelCircleOutline />}
                    >
                        Сбор завершен
                    </PlaceholderCentered>
                </DropZoneContainer>
            ) : (
                <DropZoneContainer
                    data-automation-id='upload-page-dropZone'
                    {...getRootProps({ isFocused, isDragAccept, isDragReject })}
                >
                    <input
                        type='file'
                        {...getInputProps()}
                        disabled={isLoading}
                    />

                    {isLoading ? (
                        <Spinner size='large' />
                    ) : (
                        <PlaceholderCentered
                            icon={
                                !isDragActive && (
                                    <File
                                        data-automation-id='upload-page-placeholder'
                                        size='m'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        Выберите файл
                                    </File>
                                )
                            }
                        >
                            или перенесите его в эту область для загрузки
                        </PlaceholderCentered>
                    )}
                </DropZoneContainer>
            )}
        </DivStretched>
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

    return 'var(--vkui--color_icon_secondary)';
};

const DivStretched = styled(Div)`
    display: flex;
    flex-grow: 1;
`;

interface DropZoneContainerProps {
    isFocused?: boolean;
    isDragAccept?: boolean;
    isDragReject?: boolean;
    isDisabled?: boolean;
}

const DropZoneContainer = styled.div<DropZoneContainerProps>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;

    padding: 20px;

    border-width: 2px;
    border-radius: 8px;
    border-color: ${(props) => getColor(props)};
    border-style: dashed;

    background-color: var(--vkui--color_background_content);
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;

    &:hover {
        border-color: ${({ isDisabled }) =>
            isDisabled ? 'var(--vkui--color_icon_secondary)' : 'var(--vkui--color_stroke_accent)'};
    }
`;

const PlaceholderCentered = styled(Placeholder)`
    height: 100%;
`;
