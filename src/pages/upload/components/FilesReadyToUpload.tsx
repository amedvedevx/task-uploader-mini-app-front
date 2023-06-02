import { Header, HorizontalScroll } from '@vkontakte/vkui';
import type { FC } from 'react';

import { inclinationWord } from '@/lib';

import { HorizontalFileCell } from './HorizontalFileCell';

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

        <HorizontalScroll
            showArrows
            data-automation-id='upload-page-filesList'
        >
            <div style={{ display: 'flex' }}>
                {files.map(({ name, lastModified }) => (
                    <HorizontalFileCell
                        key={lastModified}
                        title={name}
                        type='delete'
                        onClick={() => removeFile(lastModified)}
                    />
                ))}
            </div>
        </HorizontalScroll>
    </>
);
