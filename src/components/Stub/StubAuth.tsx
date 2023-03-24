import type { FC } from 'react';
import styled from 'styled-components';

import DocAndImageIcon from '@/assets/docAndImgIcon.svg';

import { StubImageContainer, StubImage, StubTitle } from './components/components';

export const StubAuth: FC = () => (
    <StubAuthContainer>
        <StubImageWrapper>
            <StubImageContainer>
                <StubImage
                    src={DocAndImageIcon}
                    border='2px solid white'
                />
            </StubImageContainer>

            <StubTitle
                color='#fff'
                weight='1'
            >
                Нет доступа к приложению
            </StubTitle>
        </StubImageWrapper>
    </StubAuthContainer>
);

const StubAuthContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 90%;
    padding: 32px 16px;

    user-select: none;
`;

const StubImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;
