import { HorizontalScroll as HorizontalScrollVkUi } from '@vkontakte/vkui';
import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface HorizontalScrollProps {
    children: ReactNode;
}

export const HorizontalScroll: FC<HorizontalScrollProps> = ({ children }) => (
    <HorizontalScrollVkUi data-automation-id='upload-page-filesList'>
        <HorizontalScrollContainer>{children}</HorizontalScrollContainer>
    </HorizontalScrollVkUi>
);

const HorizontalScrollContainer = styled.div`
    display: flex;
    padding: 8px 0px;
`;
