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

export const SkeletonTabs = styled.div`
    display: flex;
    background: var(--skeleton_tabbar_background);
    align-items: center;
    min-height: 48px;
    justify-content: space-around;
`;

export const SkeletonTab = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
`;
