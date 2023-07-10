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

export const HorizontalFileCell: FC<HorizontalFileCellProps> = ({
    title,
    fileExtension,
    type,
    onClick,
}) => {
    const getExtensionColorNumber = (extension: string) => {
        switch (extension) {
            case 'png':
                return 1;

            case 'jpg':
                return 2;

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

    return (
        <HorizontalCellOverflow
            disabled
            header={title}
            size='m'
            data-automation-id='upload-page-cellFile'
        >
            <FileImage
                gradientColor={calcInitialsAvatarColor(getExtensionColorNumber(fileExtension))}
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
    border-radius: 10px;
    position: relative;
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
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 4;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }
`;

const DownloadIcon = styled(Icon24DoorArrowLeftOutline)`
    transform: rotate(90deg);
    color: var(--vkui--color_background_content);

    background-clip: content-box;
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;
    box-shadow: none;

    background: var(--vkui--color_text_accent_themed);
    padding: 0px !important;
`;

const DeleteIcon = styled(Icon24DismissSubstract)`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;
    box-shadow: none;

    color: var(--vkui--color_accent_red--hover);
    background: var(--vkui--color_background_content);
    padding: 0px !important;
`;

const SpinnerIcon = styled(Spinner)`
    .vkuiIcon--24 {
        padding: 0;
    }

    color: var(--vkui--color_background_content);

    height: 24px;
    width: 24px;

    box-shadow: 0px 1px 4px var(--vkui--color_image_border_alpha);
    background-clip: content-box;
    background-color: #808080;
    border-radius: 50%;

    padding: 0px !important;
    margin: 12px !important;
`;

const SuccessIcon = styled(Icon16DoneCircle)`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 3px solid var(--vkui--color_background_content);
    border-radius: 9999px;
    box-shadow: none;

    color: var(--vkui--color_background_content);
    background: #4bb34b;
    padding: 3px !important;
`;

const iconType = {
    download: (
        <DownloadIcon
            width={22}
            height={22}
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
