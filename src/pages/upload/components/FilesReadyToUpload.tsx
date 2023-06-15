import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';
import { HeaderShort } from '@/components/HeaderShort';

interface FilesReadyToUploadProps {
    files: File[];
    removeFile: (lastModified: number) => void;
    hadnleTypeFile: () => 'success' | 'loading' | 'delete';
}

export const FilesReadyToUpload: FC<FilesReadyToUploadProps> = ({
    files,
    removeFile,
    hadnleTypeFile,
}) => (
    <>
        <HeaderShort mode='secondary'>
            {`Готово к загрузке ${files.length} 
                    ${inclinationWord(files.length, ['файл', 'файла', 'файлов'])}`}
        </HeaderShort>

        <HorizontalScroll data-automation-id='upload-page-filesList'>
            {files.map(({ name, lastModified }) => (
                <HorizontalFileCell
                    key={lastModified}
                    title={name}
                    type={hadnleTypeFile()}
                    onClick={() => removeFile(lastModified)}
                />
            ))}
        </HorizontalScroll>
    </>
);
