import { Button, FixedLayout, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

interface FooterWithButtonProps {
    onClick: React.MouseEventHandler<HTMLElement> | undefined;
    text: string;
    primary?: boolean;
}

export const FooterWithButton: FC<FooterWithButtonProps> = ({ text, primary, onClick }) => (
    <FixedLayout
        filled
        vertical='bottom'
    >
        <Separator wide />

        <ActionWrapper>
            <Button
                stretched
                size='l'
                mode={primary ? 'primary' : 'secondary'}
                appearance={primary ? 'accent' : 'negative'}
                onClick={onClick}
            >
                {text}
            </Button>
        </ActionWrapper>
    </FixedLayout>
);

const ActionWrapper = styled.div`
    padding: 16px 20px;
`;
