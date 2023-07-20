import type { FC } from 'react';
import { FormItem, Input, Platform, Textarea as TextareaRoot, usePlatform } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control, ValidationRule } from 'react-hook-form';
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
    pattern?: ValidationRule<RegExp>;
}

export const CreateInput: FC<CreateInputProps> = ({
    label,
    control,
    placeholder,
    inputName,
    required,
    pattern,
}) => {
    const hardWarePlatform = usePlatform();
    const isIOSPlatform = hardWarePlatform === Platform.IOS;

    const maxLength = inputName === 'collectionName' ? 48 : 128;

    return (
        <CreateInputContainer>
            <Controller
                render={({ field: { onChange, onBlur, value, ref }, formState: { errors } }) => (
                    <FormItemRoot
                        top={
                            <InputLabel
                                label={label}
                                curLength={value?.length || 0}
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
                            parseErrorType(errors.collectionName.type)
                        }
                    >
                        {inputName === 'collectionName' ? (
                            <Input
                                getRootRef={ref}
                                placeholder={placeholder}
                                value={value.trimStart()}
                                status={errors.collectionName && 'error'}
                                maxLength={maxLength}
                                minLength={3}
                                data-automation-id='create-page-titleInput'
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        ) : (
                            <Textarea
                                grow
                                $isIOSPlatform={isIOSPlatform}
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
                rules={{ required, maxLength, minLength: 3, pattern }}
            />
        </CreateInputContainer>
    );
};

const parseErrorType = (type: string): string | false => {
    switch (type) {
        case 'required':
            return 'Укажите название сбора';
        case 'minLength':
            return 'Название должно содержать минимум 3 символа';
        case 'pattern':
            return 'Названия состоящие только из спецсимволов запрещёны';

        default:
            return false;
    }
};

const CreateInputContainer = styled.div`
    margin-bottom: 20px;
`;

const FormItemRoot = styled(FormItem)`
    padding: 0;
    text-align: left;
`;

const Textarea = styled(TextareaRoot)<{ $isIOSPlatform: boolean }>`
    .vkuiTextarea__el {
        ${({ $isIOSPlatform }) => ($isIOSPlatform ? 'margin-bottom: 12px' : '')};
    }
`;
