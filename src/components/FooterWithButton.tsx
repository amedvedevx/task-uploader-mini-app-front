import { Button, ButtonGroup, Counter, Div, FixedLayout, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';

export type ButtonOption = {
    onClick: () => unknown;
    text: string;
    appearance?: 'accent' | 'positive' | 'negative' | 'neutral' | 'overlay' | 'accent-invariable';
    mode?: 'link' | 'primary' | 'secondary' | 'tertiary' | 'outline';
    loading: boolean;
    counter?: number;
    disabled?: boolean;
};

interface FooterWithButtonProps {
    options: ButtonOption[];
}

export const FooterWithButton: FC<FooterWithButtonProps> = ({ options }) => (
    <FixedLayout
        filled
        vertical='bottom'
    >
        <Separator wide />

        <Div>
            <ButtonGroup
                stretched
                gap='s'
            >
                {options.map(({ appearance, mode, text, onClick, loading, disabled, counter }) => (
                    <Button
                        key={text}
                        stretched
                        mode={mode || 'primary'}
                        appearance={appearance || 'accent'}
                        loading={loading}
                        disabled={loading || disabled}
                        after={<Counter size='s'>{counter}</Counter>}
                        onClick={onClick}
                    >
                        {text}
                    </Button>
                ))}
            </ButtonGroup>
        </Div>
    </FixedLayout>
);
