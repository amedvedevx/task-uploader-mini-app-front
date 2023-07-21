import React from 'react';
import { Alert as AlertRoot, Platform, PopoutWrapper, usePlatform } from '@vkontakte/vkui';
import styled from 'styled-components';

interface PopoutProps {
    setPopout: (arg: JSX.Element | null) => void;
    action: () => void;
    actionText: string;
    header: string;
    text: string;
    destructiveAction?: boolean;
}

export const Popout: React.FC<PopoutProps> = ({
    header,
    text,
    setPopout,
    actionText,
    action,
    destructiveAction,
}) => {
    const platform = usePlatform();

    const trimTextForIos = (title: string) => title.split(' ')[0];

    return (
        <PopoutAbsolute
            hasMask={false}
            data-automation-id='common-popout'
        >
            <Alert
                $destructiveAction={destructiveAction}
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

const Alert = styled(AlertRoot)<{ $destructiveAction?: boolean }>`
    ${({ $destructiveAction }) =>
        $destructiveAction &&
        `.vkuiButton--mode-primary {
        background: var(--vkui--color_text_negative);

        :hover {
            background-color: var(--vkui--color_background_negative--hover) !important;
        }
        `};
`;
