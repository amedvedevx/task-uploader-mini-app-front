import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonRectangle } from '@/components/Skeletons';

export const CollectionHistorySkeleton: FC = () => (
    <SkeletonWrapper>
        <SkeletonRectangle
            width='100%'
            height='56px'
        />

        <SkeletonRectangle
            width='100%'
            height='56px'
        />

        <SkeletonRectangle
            width='100%'
            height='56px'
        />
    </SkeletonWrapper>
);

const SkeletonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
