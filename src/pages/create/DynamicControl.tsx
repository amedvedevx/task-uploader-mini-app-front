import { Checkbox, FormItem, Input, Radio } from '@vkontakte/vkui';
import type { Control, RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import { InputLabel } from './components/InputLabel';

export type ControlType = 'text' | 'radio' | 'checkbox';

export interface SelectOption {
    // label: string;
    id: number;
    title: string;
    value: string;
    description: string;
}

export interface DynamicFieldData {
    title: string;
    label: string;
    inputType: ControlType;
    fieldName: string;
    defaultValue: any;
    options?: SelectOption[];
    config?: RegisterOptions;
    // control: Control;
}

export interface I {
    label: string;
    inputType: ControlType;
    fieldName: string;
    defaultValue: any;
    options?: SelectOption[];
    config?: RegisterOptions;
    control: Control;
}

export const DynamicControl = ({
    label,
    inputType,
    fieldName,
    defaultValue,
    options = [],
    config = {},
    control,
}: I) => {
    const { register } = useFormContext();

    switch (inputType) {
        case 'text':
            return (
                <Controller
                    render={({
                        field: { onChange, onBlur, value, ref },
                        formState: { errors },
                    }) => (
                        <FormItem top={<InputLabel label={label} />}>
                            <Input
                                getRootRef={ref}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        </FormItem>
                    )}
                    name={fieldName}
                    control={control}
                />
            );

        case 'radio': {
            return (
                <Controller
                    render={({ field: { onChange } }) => (
                        <FormItem top={label}>
                            {options.map(({ id, title, value, description }) => (
                                <Radio
                                    key={id}
                                    defaultChecked={options[0].value === value}
                                    name='radio'
                                    value={value}
                                    description={description}
                                    onChange={onChange}
                                >
                                    {title}
                                </Radio>
                            ))}
                        </FormItem>
                    )}
                    name={fieldName}
                    control={control}
                />
            );
        }
        case 'checkbox':
            return (
                <Controller
                    render={({ field: { onChange } }) => (
                        <FormItem top={label}>
                            {options.map(({ id, title, value, description }) => (
                                <Checkbox
                                    key={id}
                                    name={fieldName}
                                    value={value}
                                    description={description}
                                    onChange={onChange}
                                >
                                    {title}
                                </Checkbox>
                            ))}
                        </FormItem>
                    )}
                    name={fieldName}
                    control={control}
                />
            );
        default:
            return <input type='text' />;
    }
};
