import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonRectangle } from '@/components/Skeletons';

export const PanelHeaderSkeleton: FC = () => (
    <SkeletonWrapper>
        <SkeletonRectangle
            height='37px'
            width='50%'
        />
    </SkeletonWrapper>
);

const SkeletonWrapper = styled.div`
    display: flex;
    align-items: center;
    min-height: 52px;
`;
