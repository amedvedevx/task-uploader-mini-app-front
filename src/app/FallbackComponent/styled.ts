import { Icon20More, Icon28ClearDataOutline } from '@vkontakte/icons';
import styled from 'styled-components';

export const StubWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
`;

export const ClearDataIcon = styled(Icon28ClearDataOutline)`
    padding: 0 8px;
`;

export const MoreIcon = styled(Icon20More)`
    padding: 0 8px;
`;
