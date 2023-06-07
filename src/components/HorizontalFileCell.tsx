import { HorizontalCell, Image, IconButton } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import {
    Icon24DismissDark,
    Icon24DoorArrowLeftOutline,
    Icon32DocumentOutline,
} from '@vkontakte/icons';

interface HorizontalFileCellProps {
    title: string;
    type?: 'download' | 'delete';
    onClick?: () => void;
}

export const HorizontalFileCell: FC<HorizontalFileCellProps> = ({ title, type, onClick }) => (
    <HorizontalCellOverflow
        disabled
        header={title}
        size='m'
        data-automation-id='upload-page-cellFile'
    >
        <Image size={66}>
            <Icon32DocumentOutline />

            <CellButton
                aria-label='fileIconButton'
                onClick={onClick}
            >
                {type && iconType[type]}
            </CellButton>
        </Image>
    </HorizontalCellOverflow>
);

const CellButton = styled(IconButton)`
    position: absolute;
    top: -22px;
    right: -22px;
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
    color: var(--vkui--color_icon_accent);

    box-shadow: 0px 1px 4px var(--vkui--color_image_border_alpha);
    background-clip: content-box;
    background-color: var(--vkui--color_background_content);
    border-radius: 50%;

    padding: 0px !important;
    margin: 12px !important;
`;

const iconType = {
    download: <DownloadIcon />,
    delete: <Icon24DismissDark />,
};
