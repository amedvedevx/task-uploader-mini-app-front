import { Header, List, Cell, Avatar, calcInitialsAvatarColor } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

import {
    inclinationWord,
    getFileExtension,
    formatFileDate,
    parseFileSize,
    getExtenstionInitials,
} from '@/lib';

interface FilesReadyToUploadProps {
    files: File[];
    removeFile: (lastModified: number) => void;
}

export const FilesReadyToUpload: FC<FilesReadyToUploadProps> = ({ files, removeFile }) => (
    <>
        <Header mode='secondary'>
            {`Готово к загрузке ${files.length} 
                    ${inclinationWord(files.length, ['файл', 'файла', 'файлов'])}`}
        </Header>

        <List data-automation-id='upload-page-filesList'>
            {files.map(({ name, lastModified, size }) => (
                <Cell
                    key={lastModified}
                    data-automation-id='upload-page-cellFile'
                    mode='removable'
                    subtitle={`${getFileExtension(name)} - ${formatFileDate(
                        lastModified,
                    )} - ${parseFileSize(size)}`}
                    before={
                        <AvatarSquared
                            initials={getExtenstionInitials(name)}
                            gradientColor={calcInitialsAvatarColor(size)}
                        />
                    }
                    onRemove={() => removeFile(lastModified)}
                >
                    {name}
                </Cell>
            ))}
        </List>
    </>
);

const AvatarSquared = styled(Avatar)`
    border-radius: 4px;
`;
