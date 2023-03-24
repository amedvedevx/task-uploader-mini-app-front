import type { FC, ReactNode } from 'react';

import DocAndImageIcon from '@/assets/docAndImgIcon.svg';

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
    image: string;
}

export const Stub: FC<StubProps> = ({ children, title, subtitle, image }) => (
    <StubContainer>
        <StubImageContainer>
            <StubImage
                src={image || DocAndImageIcon}
                border='2px solid white'
            />
        </StubImageContainer>

        <StubTitle
            color='#000'
            weight='1'
        >
            {title}
        </StubTitle>

        <StubSubtitle color='var(--vkui--color_text_secondary)'>{subtitle}</StubSubtitle>

        {children}
    </StubContainer>
);
