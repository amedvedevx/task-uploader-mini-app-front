import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonCircular, SkeletonRectangle } from '@/pages/components';

export const SkeletonListEl: FC = () => (
    <SkeletonCardContainer>
        <SkeletonTimeblock>
            <SkeletonRectangle
                width='15%'
                height='22px'
            />

            <SkeletonRectangle
                width='25%'
                height='14px'
            />
        </SkeletonTimeblock>

        <SkeletonCard>
            <SkeletonRectangle
                width='86%'
                height='22px'
            />

            <InlineBlock>
                <SkeletonCircular radius={20} />

                <SkeletonRectangle
                    width='75%'
                    height='14px'
                />
            </InlineBlock>

            <InlineBlock>
                <SkeletonCircular radius={20} />

                <SkeletonRectangle
                    width='17%'
                    height='14px'
                />
            </InlineBlock>
        </SkeletonCard>
    </SkeletonCardContainer>
);

const SkeletonCardContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding-left: 32px;
    padding-right: 16px;
    position: relative;
`;

const SkeletonTimeblock = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 8px;
`;

const SkeletonCard = styled.div`
    background: var(--modal_card_background)
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 11px 20px rgba(75, 71, 178, 0.05);

    display: flex;
    flex-direction: column;
    gap: 17px;
`;

const InlineBlock = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;
