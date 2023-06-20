import { Div } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonCircular, SkeletonRectangle } from '@/components/Skeletons';

export const SkeletonDescription: FC = () => (
    <Div>
        <DescriptionRow>
            <SkeletonCircular radius={20} />

            <SkeletonRectangle
                height='20px'
                width='100%'
            />
        </DescriptionRow>
    </Div>
);

const DescriptionRow = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
`;
