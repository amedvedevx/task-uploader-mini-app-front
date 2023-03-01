import styled from 'styled-components';
import { Text } from '@vkontakte/vkui';

interface StubImageProps {
    border: string;
}

interface StubTitleProps {
    color: string;
}

interface StubSubtitleProps extends StubTitleProps {}

export const StubContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    user-select: none;
`;

export const StubImageContainer = styled.div`
    width: 180px;
    height: 180px;
    margin-bottom: 10px;

    background: linear-gradient(135deg, #eef4ff 0%, #70a2ff 100%);

    border-radius: 50%;

    position: relative;

    display: contents;
`;

export const StubImage = styled.img<StubImageProps>`
    margin: 18px;
`;

export const StubTitle = styled(Text)<StubTitleProps>`
    margin-bottom: 5px;
    font-size: 17px;

    color: ${({ color }) => `${color}`};
`;

export const StubSubtitle = styled(Text)<StubSubtitleProps>`
    font-size: 14px;

    white-space: pre-wrap;
    text-align: center;

    color: ${({ color }) => `${color}`};
    width: ${({ width }) => width};
`;
