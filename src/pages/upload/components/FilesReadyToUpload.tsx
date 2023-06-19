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

    return (
        <>
            <HeaderShort mode='secondary'>
                {files.length
                    ? `К отправке ${files.length}  ${inclinationWord(files.length, [
                          'файл',
                          'файла',
                          'файлов',
                      ])}, отправлено - ${Number(uploadedFiles?.length)}  ${inclinationWord(
                          Number(uploadedFiles?.length),
                          ['файл', 'файла', 'файлов'],
                      )} `
                    : `Отправлено ${Number(uploadedFiles?.length)}  ${inclinationWord(
                          Number(uploadedFiles?.length),
                          ['файл', 'файла', 'файлов'],
                      )}`}
            </HeaderShort>

            <HorizontalScroll data-automation-id='upload-page-filesList'>
                {allFiles.map(({ name, lastModified, title, uploadDate }) => (
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
