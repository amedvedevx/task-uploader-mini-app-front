import { Button, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

interface FooterWithButtonProps {
    onClick?: React.MouseEventHandler<HTMLElement>;
    text: string;
}

export const FooterWithButton: FC<FooterWithButtonProps> = ({ onClick, text }) => (
    <FooterContainer>
        <Separator wide />

        <ActionWrapper>
            <Button
                stretched
                size='l'
                mode='secondary'
                appearance='negative'
                onClick={onClick}
            >
                {text}
            </Button>
        </ActionWrapper>
    </FooterContainer>
);

const FooterContainer = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
`;

const ActionWrapper = styled.div`
    padding: 16px 20px;
`;
