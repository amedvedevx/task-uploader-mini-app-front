import type { FC } from 'react';
import styled from 'styled-components';
import { Div, Text } from '@vkontakte/vkui';

import { StubImageContainer, StubImage, StubTitle, StubSubtitle } from './components/components';

export const StubAuth: FC = () => (
    <StubAuthContainer>
        <StubImageWrapper>
            <StubImageContainer>
                <StubImage
                    // src={catWondered}
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

        <StubTextContainer>
            <StubText>Чтобы войти:</StubText>

            <StubTitle color='#fff'>
                <StubList>
                    <li>откройте «Чаты» в вашем электронном дневнике</li>

                    <li>свяжите аккаунт с учебным профилем Сферум</li>
                </StubList>
            </StubTitle>
        </StubTextContainer>

        <StubSubtitle
            color='#e1e3e6'
            width='80%'
        >
            Информация из дневника появится здесь и будет обновляться каждый день
        </StubSubtitle>
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

const StubTextContainer = styled(Div)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
`;

const StubImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

const StubText = styled(Text)`
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    color: #fff;
    margin-bottom: 8px;
`;

const StubList = styled.ul`
    margin: 0px;
`;
