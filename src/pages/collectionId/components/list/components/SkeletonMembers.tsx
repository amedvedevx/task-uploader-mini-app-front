import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonCircular, SkeletonRectangle } from '@/components/Skeletons';

export const SkeletonMembers: FC = () => (
    <SkeletonWrapper>
        <SkeletonRectangle
            width='200px'
            height='16px'
        />

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
    padding: 0 16px;
    gap: 8px;
`;

const SkeletonCard = styled.div`
    display: flex;
    gap: 12px;
    /* padding: 0 16px; */
`;
