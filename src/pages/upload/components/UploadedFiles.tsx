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

interface UploadedFilesProps {
    files: File[];
    removeFile: (lastModified: number) => void;
}

export const UploadedFiles: FC<UploadedFilesProps> = ({ files, removeFile }) => (
    <>
        <Header mode='secondary'>
            {`Загружено ${files.length} 
                    ${inclinationWord(files.length)}`}
        </Header>

        <List>
            {files.map(({ name, lastModified, size }) => (
                <Cell
                    key={lastModified}
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
