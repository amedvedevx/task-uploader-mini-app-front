import React from 'react';
import { Alert, PopoutWrapper } from '@vkontakte/vkui';
import styled from 'styled-components';

interface PopoutProps {
    setPopout: (arg: JSX.Element | null) => void;
    action: () => void;
    actionText: string;
    header: string;
    text: string;
}

export const Popout: React.FC<PopoutProps> = ({ header, text, setPopout, actionText, action }) => (
    <PopoutAbsolute hasMask={false}>
        <Alert
            header={header}
            text={text}
            actions={[
                {
                    title: 'Отмена',
                    autoClose: true,
                    mode: 'cancel',
                },
                {
                    title: actionText,
                    mode: 'destructive',
                    autoClose: true,
                    action,
                },
            ]}
            onClose={() => {
                setPopout(null);
            }}
        />
    </PopoutAbsolute>
);

const PopoutAbsolute = styled(PopoutWrapper)`
    z-index: 20;
`;
