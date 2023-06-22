import React from 'react';
import { Alert, Platform, PopoutWrapper, usePlatform } from '@vkontakte/vkui';
import styled from 'styled-components';

interface PopoutProps {
    setPopout: (arg: JSX.Element | null) => void;
    action: () => void;
    actionText: string;
    header: string;
    text: string;
}

export const Popout: React.FC<PopoutProps> = ({ header, text, setPopout, actionText, action }) => {
    const platform = usePlatform();

    const trimTextForIos = (title: string) => title.split(' ')[0];

    return (
        <PopoutAbsolute hasMask={false}>
            <Alert
                data-automation-id='common-popout-buttons'
                header={header}
                text={text}
                actions={[
                    {
                        title: 'Отмена',
                        autoClose: true,
                        mode: 'cancel',
                    },
                    {
                        title: platform === Platform.IOS ? trimTextForIos(actionText) : actionText,
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
};

const PopoutAbsolute = styled(PopoutWrapper)`
    z-index: 20;
`;
