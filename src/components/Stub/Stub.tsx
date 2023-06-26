import type { FC, ReactNode } from 'react';
import { useAppearance } from '@vkontakte/vkui';

import DocAndImageIcon from '@/assets/docAndImgIcon.svg';
import { checkIsMobilePlatform } from '@/lib';
import { useBridgePlatform } from '@/hooks';

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
    image?: string;
}

export const Stub: FC<StubProps> = ({ children, title, subtitle, image }) => {
    const appearance = useAppearance();
    const platform = useBridgePlatform();
    const isMobilePlatform = checkIsMobilePlatform(platform);

    console.log('appearance', appearance);

    const handleColor = () => {
        if (isMobilePlatform) {
            if (appearance === 'dark') {
                return 'white';
            }

            return 'black';
        }

        if (appearance === 'light') {
            return 'var(--vkui--color_text_primary)';
        }

        return 'black';
    };

    return (
        <StubContainer>
            <StubImageContainer>
                <StubImage
                    src={image || DocAndImageIcon}
                    border='2px solid white'
                />
            </StubImageContainer>

            <StubTitle
                color={handleColor()}
                weight='1'
            >
                {title}
            </StubTitle>

            <StubSubtitle color='var(--vkui--color_text_secondary)'>{subtitle}</StubSubtitle>

            {children}
        </StubContainer>
    );
};
