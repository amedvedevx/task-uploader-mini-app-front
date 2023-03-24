import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonAnimation } from './SkeletonAnimation';

interface SkeletonRectangleProps {
    width: string;
    height: string;
}

interface SkeletonElProps {
    $width: string;
    $height: string;
}

export const SkeletonRectangle: FC<SkeletonRectangleProps> = ({ width, height }) => (
    <SkeletonEl
        $width={width}
        $height={height}
    />
);
const SkeletonEl = styled(SkeletonAnimation)<SkeletonElProps>`
    height: ${({ $height }) => `${$height}`};
    width: ${({ $width }) => `${$width}`};
    border-radius: 4px;
`;
