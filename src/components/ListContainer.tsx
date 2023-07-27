import styled from 'styled-components';

export const ListContainer = styled.div<{ $fixedLayoutHeight: string }>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    padding-top: ${({ $fixedLayoutHeight }) => `${$fixedLayoutHeight}px`};
    padding-bottom: 52px;
`;
