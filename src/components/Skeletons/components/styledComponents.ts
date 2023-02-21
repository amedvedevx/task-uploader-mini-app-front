import styled from 'styled-components';

export const SkeletonPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
`;

export const SkeletonHeader = styled.div`
    display: flex;
    background: var(--header_background);
    justify-content: center;
    align-items: center;
    min-height: 52px;
`;
