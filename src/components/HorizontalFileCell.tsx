import { HorizontalCell, Image, IconButton, PanelHeader } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { Icon24DismissDark, Icon24DownloadOutline, Icon32DocumentOutline } from '@vkontakte/icons';

interface HorizontalFileCellProps {
    title: string;
    type?: 'download' | 'delete';
    onClick?: () => void;
}

const iconType = {
    download: <Icon24DownloadOutline />,
    delete: <Icon24DismissDark />,
};

export const HorizontalFileCell: FC<HorizontalFileCellProps> = ({ title, type, onClick }) => (
    <HorizontalCell
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
    </HorizontalCell>
);

const CellButton = styled(IconButton)`
    position: absolute;
    top: -22px;
    right: -22px;
`;
