import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import type { TaskDetailResultContent } from '@/app/types';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';
import { HeaderShort } from '@/components/HeaderShort';

interface UploadedFilesProps {
    files: TaskDetailResultContent[];
}

export const UploadedFiles: FC<UploadedFilesProps> = ({ files }) => (
    <>
        <HeaderShort mode='secondary'>
            {`Загружено ${files.length} 
                    ${inclinationWord(files.length, ['файл', 'файла', 'файлов'])}`}
        </HeaderShort>

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
