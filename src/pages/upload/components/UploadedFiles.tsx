import { Icon32Document } from '@vkontakte/icons';
import { Header, List, Cell } from '@vkontakte/vkui';
import type { FC } from 'react';

import { inclinationWord, getFileExtension, formatFileDate, parseFileSize } from '@/lib';

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
                    before={<Icon32Document />}
                    onRemove={() => removeFile(lastModified)}
                >
                    {name}
                </Cell>
            ))}
        </List>
    </>
);
