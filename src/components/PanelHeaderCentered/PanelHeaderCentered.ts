import { PanelHeader } from '@vkontakte/vkui';
import styled from 'styled-components';

export const PanelHeaderCentered = styled(PanelHeader)`
    .vkuiPanelHeader__before {
        z-index: 1;
    }
    .vkuiPanelHeader__content {
        width: 100%;

        padding: 0px;

        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .vkuiPanelHeader__content-in {
        width: 70%;
        text-align: center;
    }
`;
