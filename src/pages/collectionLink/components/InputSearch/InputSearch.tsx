import type { FC } from 'react';
import { FormItem, Input } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Icon16SearchOutline } from '@vkontakte/icons';

interface InputSearchProps {
    control: Control<
        {
            search: string;
        },
        any
    >;
    label?: string;
    placeholder: string;
}

export const InputSearch: FC<InputSearchProps> = ({ label, control, placeholder }) => (
    <CreateInputContainer>
        <FormItem
            top={label}
            style={{ padding: 0 }}
        >
            <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                        before={<Icon16SearchOutline />}
                        getRootRef={ref}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name='search'
                control={control}
                rules={{ required: true }}
            />
        </FormItem>
    </CreateInputContainer>
);

const CreateInputContainer = styled.div`
    margin-bottom: 24px;
`;
