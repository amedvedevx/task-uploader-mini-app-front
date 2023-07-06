import React from 'react';
import { Alert, FormItem, Input, Platform, PopoutWrapper, usePlatform } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import Captcha from '@/assets/captcha.jpeg';

interface PopoutCaptchaProps {
    setPopout: (arg: JSX.Element | null) => void;
    action: () => void;
    actionText: string;
    control: Control<{
        captcha: string;
    }>;
}

export const PopoutCaptcha: React.FC<PopoutCaptchaProps> = ({
    control,
    setPopout,
    actionText,
    action,
}) => {
    const platform = usePlatform();

    const trimTextForIos = (title: string) => title.split(' ')[0];

    return (
        <PopoutAbsolute
            hasMask={false}
            data-automation-id='common-popout'
        >
            <Alert
                header='Введите код с картинки'
                actions={[
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
            >
                <FormContainer>
                    <img
                        src={Captcha}
                        alt='captcha'
                    />

                    <Controller
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <FormItemRoot>
                                <Input
                                    placeholder='Введите код'
                                    getRootRef={ref}
                                    value={value.trimStart()}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            </FormItemRoot>
                        )}
                        name='captcha'
                        control={control}
                    />
                </FormContainer>
            </Alert>
        </PopoutAbsolute>
    );
};

const PopoutAbsolute = styled(PopoutWrapper)`
    z-index: 20;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 13px;

    margin-top: 20px;
`;

const FormItemRoot = styled(FormItem)`
    padding: 0;
    text-align: left;
`;
