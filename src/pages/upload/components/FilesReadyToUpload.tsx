import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';
import { HeaderShort } from '@/components/HeaderShort';
import type { TaskDetailResultContent } from '@/app/types';

interface FilesReadyToUploadProps {
    files: File[];
    uploadedFiles: TaskDetailResultContent[];
    removeFile: (modifiedPlusSize: number) => void;
    getFileStatus: (uploadDate: string) => 'success' | 'loading' | 'delete';
}

export const FilesReadyToUpload: FC<FilesReadyToUploadProps> = ({
    files,
    uploadedFiles,
    removeFile,
    getFileStatus,
}) => {
    const filesToUpload = [...files].reverse();
    const filesUploaded = [...uploadedFiles].reverse();

    const hasUploadedFiles = !!uploadedFiles && uploadedFiles?.length > 0;

    const uploadedCount = hasUploadedFiles
        ? `${Number(uploadedFiles.length)}  ${inclinationWord(Number(uploadedFiles.length), [
              'файл',
              'файла',
              'файлов',
          ])}`
        : '';

    const stringSent = hasUploadedFiles ? `Отправлено - ${uploadedCount}` : '';

    const stringToSend =
        files?.length > 0
            ? `К отправке - ${files.length}  ${inclinationWord(files.length, [
                  'файл',
                  'файла',
                  'файлов',
              ])} ${hasUploadedFiles ? `, отправлено - ${uploadedCount}` : ''}`
            : stringSent;

    const filesLabel = `${stringToSend}`;

    return (
        <>
            <HeaderShort mode='secondary'>{filesLabel}</HeaderShort>

            <HorizontalScroll data-automation-id='upload-page-filesList'>
                {filesToUpload.map(({ name, lastModified, size }) => (
                    <HorizontalFileCell
                        key={lastModified + size}
                        title={name}
                        type='delete'
                        onClick={() => removeFile(lastModified + size)}
                    />
                ))}

                {filesUploaded.map(({ title, docId, uploadDate }) => (
                    <HorizontalFileCell
                        key={docId}
                        title={title}
                        type={getFileStatus(uploadDate)}
                    />
                ))}
            </HorizontalScroll>
        </>
    );
};
