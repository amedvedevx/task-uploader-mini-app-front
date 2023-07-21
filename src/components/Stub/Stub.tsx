import type { FC, ReactNode } from 'react';

import {
    StubContainer,
    StubImageContainer,
    StubImage,
    StubTitle,
    StubSubtitle,
} from './components/components';

interface StubProps {
    children?: ReactNode;
    title: string;
    subtitle: string;
}

export const Stub: FC<StubProps> = ({ children, title, subtitle }) => (
    <StubContainer>
        <StubImageContainer>
            <StubImage
                width={50}
                height={50}
                color='var(--vkui--color_text_negative)'
            />
        </StubImageContainer>

        <StubTitle
            color='var(--vkui--color_text_primary)'
            weight='1'
        >
            {title}
        </StubTitle>

        <StubSubtitle color='var(--vkui--color_text_secondary)'>{subtitle}</StubSubtitle>

        {children}
    </StubContainer>
);
