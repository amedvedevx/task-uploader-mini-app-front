/* eslint-disable react/jsx-props-no-spreading */
import { Icon56DocumentOutline } from '@vkontakte/icons';
import { Div, Placeholder, File, Spinner } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { getFileExtension } from '@/lib/utils';

import type { SnackBarType } from '../UploadPage';

interface DropZoneProps {
    isLoading: boolean;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setSnackbar: React.Dispatch<React.SetStateAction<SnackBarType>>;
}

// 200 MB
const maxFileSize = 209715200;
const forbiddenFileExtension = ['exe', 'app'];
const rejectFileMessage = { code: 'reject', message: 'wrong-file' };

export const DropZone: FC<DropZoneProps> = ({ isLoading, setFiles, setSnackbar }) => {
    const filesValidator = (file: File) => {
        const fileExt = getFileExtension(file.name);

        if (file.size > maxFileSize) {
            setSnackbar({ type: 'error', message: 'Размер файла слишком большой' });

            return rejectFileMessage;
        }

        if (forbiddenFileExtension.includes(fileExt)) {
            setSnackbar({ type: 'error', message: 'Не подходящий тип файла' });

            return rejectFileMessage;
        }

        return null;
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevState) => [...prevState, ...acceptedFiles]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } =
        useDropzone({ onDrop, validator: filesValidator });

    return (
        <DivStretched>
            <DropZoneContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                <input
                    type='file'
                    {...getInputProps()}
                    disabled={isLoading}
                />

                {isLoading ? (
                    <Spinner size='large' />
                ) : (
                    <PlaceholderCentered
                        icon={<Icon56DocumentOutline color='var(--vkui--color_icon_accent)' />}
                        action={
                            !isDragActive && (
                                <File
                                    size='m'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                >
                                    Выбрать файл
                                </File>
                            )
                        }
                    >
                        Для загрузки файла перенесите его в эту область
                    </PlaceholderCentered>
                )}
            </DropZoneContainer>
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

    return '#DCE1E6';
};

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

    background-color: var(--vkui--color_background_content);
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
