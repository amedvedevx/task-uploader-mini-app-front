import type { FC } from 'react';

import { inclinationWord } from '@/lib';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';
import { HeaderShort } from '@/components/HeaderShort';
import type { TaskDetailResultContent } from '@/app/types';

interface FilesReadyToUploadProps {
    files: File[];
    uploadedFiles?: TaskDetailResultContent[];
    removeFile: (lastModified: number) => void;
    getFileStatus: (uploadDate: string) => 'success' | 'loading' | 'delete';
}

export const FilesReadyToUpload: FC<FilesReadyToUploadProps> = ({
    files,
    uploadedFiles,
    removeFile,
    getFileStatus,
}) => {
    const filesToUpload = files || [];
    const filesUploaded = uploadedFiles || [];
    const allFiles = [...filesToUpload, ...filesUploaded];

    const hasUploadedFiles = !!uploadedFiles && uploadedFiles?.length > 0;

    const uploadedCount = hasUploadedFiles
        ? `${Number(uploadedFiles.length)}  ${inclinationWord(Number(uploadedFiles.length), [
              'файл',
              'файла',
              'файлов',
          ])}`
        : '';

    const stringSend = hasUploadedFiles ? `Отправлено - ${uploadedCount}` : '';

    const stringToSend =
        files?.length > 0
            ? `К отправке - ${files.length}  ${inclinationWord(files.length, [
                  'файл',
                  'файла',
                  'файлов',
              ])} ${hasUploadedFiles ? `, отправлено - ${uploadedCount}` : ''}`
            : stringSend;

    const filesLabel = `${stringToSend}`;

    return (
        <>
            <HeaderShort mode='secondary'>{filesLabel}</HeaderShort>

            <HorizontalScroll data-automation-id='upload-page-filesList'>
                {allFiles?.map(({ name, lastModified, title, uploadDate }) => (
                    <HorizontalFileCell
                        key={lastModified}
                        title={name || title}
                        type={getFileStatus(uploadDate)}
                        onClick={() => removeFile(lastModified)}
                    />
                ))}
            </HorizontalScroll>
        </>
    );
};
