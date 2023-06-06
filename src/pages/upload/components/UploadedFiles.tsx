import { Header } from '@vkontakte/vkui';
import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import type { TaskDetailResultContent } from '@/app/types';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';

interface UploadedFilesProps {
    files: TaskDetailResultContent[];
}

export const UploadedFiles: FC<UploadedFilesProps> = ({ files }) => (
    <>
        <Header mode='secondary'>
            {`Загружено ${files.length} 
                    ${inclinationWord(files.length, ['файл', 'файла', 'файлов'])}`}
        </Header>

        <HorizontalScroll data-automation-id='upload-page-filesList'>
            {files.map(({ title, docId }) => (
                <HorizontalFileCell
                    key={docId}
                    title={title}
                />
            ))}
        </HorizontalScroll>
    </>
);
