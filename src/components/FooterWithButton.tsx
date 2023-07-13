/* eslint-disable react/jsx-props-no-spreading */
import { Button, ButtonGroup, Counter, Div, FixedLayout, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';

export type ButtonOption = {
    onClick: () => void;
    text: string;
    appearance?: 'accent' | 'positive' | 'negative' | 'neutral' | 'overlay' | 'accent-invariable';
    mode?: 'link' | 'primary' | 'secondary' | 'tertiary' | 'outline';
    loading?: boolean;
    counter?: number;
    membersCounter?: number;
    disabled?: boolean;
    dataAutomationId?: string;
};

interface FooterWithButtonProps {
    options: ButtonOption[];
}

export const FooterWithButton: FC<FooterWithButtonProps> = ({ options }) => (
    <FixedLayout
        filled
        vertical='bottom'
        data-automation-id='common-footer'
    >
        <Separator wide />

        <Div>
            <ButtonGroup
                stretched
                gap='s'
                data-automation-id='common-footerButtons'
            >
                {options.map(
                    ({
                        appearance,
                        mode,
                        text,
                        onClick,
                        loading,
                        disabled,
                        counter,
                        membersCounter,
                        dataAutomationId,
                    }) => (
                        <Button
                            key={text}
                            stretched
                            size='l'
                            mode={mode || 'primary'}
                            appearance={appearance || 'accent'}
                            loading={loading}
                            disabled={loading || disabled}
                            after={
                                <>
                                    {membersCounter && (
                                        <Counter size='s'>{`${membersCounter} / 50`}</Counter>
                                    )}

                                    {counter && <Counter size='s'>{counter}</Counter>}
                                </>
                            }
                            data-automation-id={dataAutomationId}
                            onClick={onClick}
                        >
                            {text}
                        </Button>
                    ),
                )}
            </ButtonGroup>
        </Div>
    </FixedLayout>
);
