import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonCircular, SkeletonRectangle } from '@/components/Skeletons';

export const SkeletonMembers: FC = () => (
    <SkeletonWrapper>
        <SkeletonCard>
            <SkeletonCircular radius={40} />

            <SkeletonRectangle
                width='100%'
                height='40px'
            />
        </SkeletonCard>

        <SkeletonCard>
            <SkeletonCircular radius={40} />

            <SkeletonRectangle
                width='100%'
                height='40px'
            />
        </SkeletonCard>
    </SkeletonWrapper>
);

const SkeletonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 12px;
    gap: 8px;
`;

const SkeletonCard = styled.div`
    display: flex;
    gap: 12px;
`;
