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
    width: 320px;
`;

export const StubImageContainer = styled.div`
    width: 180px;
    height: 180px;
    margin-bottom: 10px;

    border-radius: 50%;

    position: relative;

    display: contents;
`;

export const StubImage = styled.img<StubImageProps>`
    margin: 34px;
`;

export const StubTitle = styled(Text)<StubTitleProps>`
    margin-bottom: 6px;
    font-size: 20px;

    color: ${({ color }) => `${color}`};
`;

export const StubSubtitle = styled(Text)<StubSubtitleProps>`
    font-size: 16px;

    white-space: pre-wrap;
    text-align: center;

    color: ${({ color }) => `${color}`};
    width: ${({ width }) => width};
`;

export const StubСacheSubtitle = styled(Text)`
    display: flex;
    margin-bottom: 10px;

    white-space: pre-wrap;
    text-align: center;

    color: var(--vkui--color_text_secondary);
`;
