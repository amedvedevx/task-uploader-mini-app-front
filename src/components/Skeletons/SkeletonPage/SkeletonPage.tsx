import type { FC } from 'react';

import { SkeletonCircular, SkeletonRectangle } from '../components';
import {
    SkeletonPageContainer,
    SkeletonHeader,
    SkeletonTab,
    SkeletonTabs,
} from '../components/styledComponents';

export const SkeletonPage: FC = () => (
    <SkeletonPageContainer>
        <SkeletonHeader>
            <SkeletonRectangle
                width='40%'
                height='28px'
            />
        </SkeletonHeader>

        <SkeletonTabs>
            <SkeletonTab>
                <SkeletonCircular radius={24} />

                <SkeletonRectangle
                    width='60%'
                    height='13px'
                />
            </SkeletonTab>

            <SkeletonTab>
                <SkeletonCircular radius={24} />

                <SkeletonRectangle
                    width='60%'
                    height='13px'
                />
            </SkeletonTab>

            <SkeletonTab>
                <SkeletonCircular radius={24} />

                <SkeletonRectangle
                    width='60%'
                    height='13px'
                />
            </SkeletonTab>

            <SkeletonTab>
                <SkeletonCircular radius={24} />

                <SkeletonRectangle
                    width='60%'
                    height='13px'
                />
            </SkeletonTab>
        </SkeletonTabs>
    </SkeletonPageContainer>
);
