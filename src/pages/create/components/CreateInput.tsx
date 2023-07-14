import type { FC } from 'react';
import { FormItem, Input, Textarea } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { InputLabel } from './InputLabel';

interface CreateInputProps {
    control: Control<{
        collectionName: string;
        collectionDescription: string;
    }>;
    label: string;
    placeholder: string;
    inputName: 'collectionName' | 'collectionDescription';
    required?: boolean;
}

export const CreateInput: FC<CreateInputProps> = ({
    label,
    control,
    placeholder,
    inputName,
    required,
}) => {
    const maxLength = inputName === 'collectionName' ? 48 : 128;
    const minLength = 5;

    return (
        <CreateInputContainer>
            <Controller
                render={({ field: { onChange, onBlur, value, ref }, formState: { errors } }) => (
                    <FormItemRoot
                        top={
                            <InputLabel
                                label={label}
                                curLength={value?.trim().length || 0}
                                maxLength={maxLength}
                            />
                        }
                        status={
                            inputName === 'collectionName' && errors.collectionName
                                ? 'error'
                                : 'default'
                        }
                        bottom={
                            inputName === 'collectionName' &&
                            errors.collectionName &&
                            errors.collectionName.message
                        }
                    >
                        {inputName === 'collectionName' ? (
                            <Input
                                getRootRef={ref}
                                placeholder={placeholder}
                                value={value.trimStart()}
                                status={errors.collectionName && 'error'}
                                maxLength={maxLength}
                                minLength={minLength}
                                data-automation-id='create-page-titleInput'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        ) : (
                            <Textarea
                                grow
                                getRootRef={ref}
                                placeholder={placeholder}
                                value={value}
                                status={errors.collectionDescription && 'error'}
                                maxLength={maxLength}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    </FormItemRoot>
                )}
                name={inputName}
                control={control}
                rules={{
                    required,
                    maxLength,
                    minLength: {
                        value: minLength,
                        message: `Минимальная длина поля должна быть более ${minLength} символов`,
                    },
                    // pattern: {
                    //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    //     message: 'Название сбора не должен содержать спец. символы',
                    // },
                }}
            />
        </CreateInputContainer>
    );
};

const CreateInputContainer = styled.div`
    margin-bottom: 20px;
`;

const FormItemRoot = styled(FormItem)`
    padding: 0;
    text-align: left;
`;
