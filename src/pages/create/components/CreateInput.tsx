import type { FC } from 'react';
import { FormItem, Input } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { InputLabel } from './InputLabel';

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
        <Controller
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormItemRoot
                    top={
                        <InputLabel
                            label={label}
                            curLength={value.length}
                        />
                    }
                >
                    <Input
                        maxLength={48}
                        getRootRef={ref}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                </FormItemRoot>
            )}
            name='collectionName'
            control={control}
            rules={{ required: true }}
        />
    </CreateInputContainer>
);

const CreateInputContainer = styled.div`
    margin-bottom: 24px;
`;

const FormItemRoot = styled(FormItem)`
    padding: 0;
    text-align: left;
`;
