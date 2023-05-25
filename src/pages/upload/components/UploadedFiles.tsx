import { Header, List, Cell, Avatar, calcInitialsAvatarColor } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

import { inclinationWord, getFileExtension, parseFileSize, getExtenstionInitials } from '@/lib';
import type { TaskDetailResultContent } from '@/app/types';

interface UploadedFilesProps {
    files: TaskDetailResultContent[];
}

export const UploadedFiles: FC<UploadedFilesProps> = ({ files }) => (
    <>
        <Header mode='secondary'>
            {`Загружено ${files.length} 
                    ${inclinationWord(files.length, ['файл', 'файла', 'файлов'])}`}
        </Header>

        <List data-automation-id='upload-page-filesList'>
            {files.map(({ title, docId, size }) => (
                <Cell
                    key={docId}
                    subtitle={`${getFileExtension(title)} - ${parseFileSize(size)}`}
                    before={
                        <AvatarSquared
                            initials={getExtenstionInitials(title)}
                            gradientColor={calcInitialsAvatarColor(size)}
                        />
                    }
                >
                    {title}
                </Cell>
            ))}
        </List>
    </>
);

const AvatarSquared = styled(Avatar)`
    border-radius: 4px;
`;
