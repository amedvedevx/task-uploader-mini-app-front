import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonAnimation } from './SkeletonAnimation';

interface SkeletonCircularProps {
    radius: number;
}

interface SkeletonElProps {
    $width: number;
    $height: number;
}

export const SkeletonCircular: FC<SkeletonCircularProps> = ({ radius }) => (
    <SkeletonEl
        $width={radius}
        $height={radius}
    />
);
const SkeletonEl = styled(SkeletonAnimation)<SkeletonElProps>`
    height: ${({ $height }) => `${$height}px`};
    width: ${({ $width }) => `${$width}px`};
    border-radius: 50%;
`;
