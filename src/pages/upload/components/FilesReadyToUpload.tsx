import { Header } from '@vkontakte/vkui';
import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';

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

        <HorizontalScroll data-automation-id='upload-page-filesList'>
            {files.map(({ name, lastModified }) => (
                <HorizontalFileCell
                    key={lastModified}
                    title={name}
                    type='delete'
                    onClick={() => removeFile(lastModified)}
                />
            ))}
        </HorizontalScroll>
    </>
);
