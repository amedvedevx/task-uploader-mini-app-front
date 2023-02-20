import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonListEl } from './components';

export const SkeletonList: FC = () => (
    <SkeletonContainer>
        <SkeletonListEl />

        <SkeletonListEl />
    </SkeletonContainer>
);

const SkeletonContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding: 8px 0 8px;
    gap: 32px;
    margin-top: 24px;
`;
