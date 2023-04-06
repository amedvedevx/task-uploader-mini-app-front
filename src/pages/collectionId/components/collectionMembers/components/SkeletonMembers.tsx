import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonCircular, SkeletonRectangle } from '@/components/Skeletons';
import type { TabType } from '@/pages';

interface SkeletonMembersProps {
    selectedTab: TabType;
}

export const SkeletonMembers: FC<SkeletonMembersProps> = ({ selectedTab }) => (
    <SkeletonWrapper $selectedTab={selectedTab}>
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

const SkeletonWrapper = styled.div<{ $selectedTab: TabType }>`
    display: flex;
    flex-direction: column;
    padding: 12px 12px;
    gap: 8px;

    ${({ $selectedTab }) =>
        $selectedTab === 'notCompleted' ? 'padding-top: 155px' : 'padding-top: 55px'};
`;

const SkeletonCard = styled.div`
    display: flex;
    gap: 12px;
`;
