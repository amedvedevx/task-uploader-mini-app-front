import type { FC } from 'react';
import { FormItem, Input } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface CreateInputProps {
    control: Control<
        {
            collectionName: string;
        },
        any
    >;
    label: string;
    placeholder: string;
}

export const CreateInput: FC<CreateInputProps> = ({ label, control, placeholder }) => (
    <CreateInputContainer>
        <FormItem
            top={label}
            style={{ padding: 0, textAlign: 'left' }}
        >
            <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                        getRootRef={ref}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                name='collectionName'
                control={control}
                rules={{ required: true }}
            />
        </FormItem>
    </CreateInputContainer>
);

const CreateInputContainer = styled.div`
    margin-bottom: 24px;
`;
