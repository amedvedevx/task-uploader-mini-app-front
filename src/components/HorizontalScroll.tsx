import { HorizontalScroll as HorizontalScrollVkUi } from '@vkontakte/vkui';
import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface HorizontalScrollProps {
    children: ReactNode;
    isDownload?: boolean;
}

export const HorizontalScroll: FC<HorizontalScrollProps> = ({ children, isDownload }) => (
    <HorizontalScrollVkUi data-automation-id='upload-page-filesList'>
        <HorizontalScrollContainer $isDownload={isDownload}>{children}</HorizontalScrollContainer>
    </HorizontalScrollVkUi>
);

const HorizontalScrollContainer = styled.div<{ $isDownload?: boolean }>`
    display: flex;
    padding: ${({ $isDownload }) => ($isDownload ? '18px 0px' : '8px 0px')};
`;
