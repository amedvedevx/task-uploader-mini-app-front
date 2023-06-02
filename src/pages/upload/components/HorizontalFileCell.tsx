import { HorizontalCell, Image, IconButton } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import {
    Icon28CancelCircleOutline,
    Icon28DownloadOutline,
    Icon32DocumentOutline,
} from '@vkontakte/icons';

interface HorizontalFileCellProps {
    title: string;
    type?: 'download' | 'delete';
    onClick?: () => void;
}

const iconType = {
    download: <Icon28DownloadOutline />,
    delete: <Icon28CancelCircleOutline />,
};

export const HorizontalFileCell: FC<HorizontalFileCellProps> = ({ title, type, onClick }) => (
    <HorizontalCell
        header={title}
        size='m'
        data-automation-id='upload-page-cellFile'
    >
        <Image size={66}>
            <Icon32DocumentOutline />
        </Image>

        <CellButton
            aria-label='fileIconButton'
            onClick={onClick}
        >
            {type && iconType[type]}
        </CellButton>
    </HorizontalCell>
);

const CellButton = styled(IconButton)`
    position: absolute;
    top: -10px;
    right: 2px;
`;
