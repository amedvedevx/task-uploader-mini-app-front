import { Icon56BlockOutline } from '@vkontakte/icons';
import { Placeholder } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

export const MembersNotFound: FC = () => (
    <NotFoundContainer>
        <Placeholder icon={<Icon56BlockOutline />}>Пользователи не найдены</Placeholder>
    </NotFoundContainer>
);

export const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`;
