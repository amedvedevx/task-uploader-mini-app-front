/* eslint-disable jsx-a11y/label-has-associated-control */
import { Icon24CheckCircleOff, Icon24CheckCircleOn } from '@vkontakte/icons';
import type { FC } from 'react';
import styled from 'styled-components';

interface CheckboxProps {
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, onChange }) => (
    <CheckbocContainer>
        <label>
            <input
                type='checkbox'
                style={{ display: 'none' }}
                checked={checked}
                onChange={onChange}
            />

            {checked ? (
                <Icon24CheckCircleOn fill='var(--vkui--color_accent_blue)' />
            ) : (
                <Icon24CheckCircleOff fill='var(--vkui--color_text_tertiary)' />
            )}
        </label>
    </CheckbocContainer>
);

const CheckbocContainer = styled.div`
    cursor: pointer;
    padding-right: 16px;
`;
