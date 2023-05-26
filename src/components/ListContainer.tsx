import styled from 'styled-components';

export const ListContainer = styled.div<{ $fixedLayoutHeight: string }>`
    padding-top: ${({ $fixedLayoutHeight }) => `${$fixedLayoutHeight}px`};
    padding-bottom: 52px;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
