import {
    HorizontalCell,
    IconButton,
    Spinner,
    calcInitialsAvatarColor,
    Avatar,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import {
    Icon24DoorArrowLeftOutline,
    Icon16DoneCircle,
    Icon24DismissSubstract,
} from '@vkontakte/icons';

import { getExtenstionInitials } from '@/lib';

interface HorizontalFileCellProps {
    title: string;
    fileExtension: string;
    type?: 'download' | 'delete' | 'loading' | 'success';
    onClick?: () => void;
}

const getExtensionColorNumber = (extension: string) => {
    switch (extension) {
        case 'png':
            return 1;

        case 'jpg':
        case 'jpeg':
            return 3;

        case 'pdf':
            return 4;

        case 'zip':
            return 5;

        default:
            return 6;
    }
};

export const HorizontalFileCell: FC<HorizontalFileCellProps> = ({
    title,
    fileExtension,
    type,
    onClick,
}) => {
    const color = getExtensionColorNumber(fileExtension);

    return (
        <HorizontalCellOverflow
            disabled
            header={title}
            size='m'
            data-automation-id='upload-page-cellFile'
        >
            <FileImage
                gradientColor={calcInitialsAvatarColor(color)}
                initials={getExtenstionInitials(title)}
                size={66}
            >
                <CellButton
                    $type={type}
                    aria-label='fileIconButton'
                    onClick={onClick}
                >
                    {type && iconType[type]}
                </CellButton>
            </FileImage>
        </HorizontalCellOverflow>
    );
};

const FileImage = styled(Avatar)`
    position: relative;

    border-radius: 10px;
`;

const CellButton = styled(IconButton)<{ $type?: 'download' | 'delete' | 'loading' | 'success' }>`
    position: absolute;
    top: -22px;
    right: ${({ $type }) => ($type === 'loading' ? '-22px' : '-26px')};

    ${({ $type }) => ($type === 'success' ? 'pointer-events: none;' : '')};

    padding: 12px;
`;

const HorizontalCellOverflow = styled(HorizontalCell)`
    .vkuiSubhead {
        display: block;
        overflow: hidden;

        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
    }
`;

const DownloadIcon = styled(Icon24DoorArrowLeftOutline)`
    padding: 3px !important;

    transform: rotate(90deg);

    color: var(--vkui--color_background_content);
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;

    background: var(--vkui--color_text_accent_themed);
    box-shadow: none;
`;

const DeleteIcon = styled(Icon24DismissSubstract)`
    padding: 0 !important;

    color: var(--vkui--color_accent_red--hover);
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;
    background: var(--vkui--color_background_content);
    box-shadow: none;
    appearance: none;
`;

const SpinnerIcon = styled(Spinner)`
    width: 24px;

    height: 24px;
    margin: 12px !important;

    padding: 0 !important;

    color: var(--vkui--color_background_content);
    border-radius: 50%;
    background-color: #808080;
    background-clip: content-box;

    box-shadow: 0 1px 4px var(--vkui--color_image_border_alpha);

    .vkuiIcon--24 {
        padding: 0;
    }
`;

const SuccessIcon = styled(Icon16DoneCircle)`
    padding: 3px !important;

    color: var(--vkui--color_background_content);
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;
    background: #4bb34b;
    box-shadow: none;
    appearance: none;
`;

const iconType = {
    download: (
        <DownloadIcon
            width={16}
            height={16}
        />
    ),
    delete: (
        <DeleteIcon
            width={22}
            height={22}
        />
    ),
    loading: <SpinnerIcon size='regular' />,
    success: <SuccessIcon />,
};
