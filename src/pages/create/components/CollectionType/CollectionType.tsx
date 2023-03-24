import type { FC } from 'react';
import { FormItem, Radio } from '@vkontakte/vkui';
import styled from 'styled-components';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface CollectionTypeProps {
    control: Control<{ collectionType: string }>;
}

const options = [
    {
        id: 1,
        title: 'Только для участников',
        value: 'members',
        description:
            'Выберите и добавьте в сбор участников групповых чатов или отдельных пользователей',
    },
    {
        id: 2,
        title: 'Для всех по ссылке',
        value: 'link',
        description: 'Создайте ссылку, которую можно отправить любому пользователю',
    },
];

export const CollectionType: FC<CollectionTypeProps> = ({ control }) => (
    <Controller
        render={({ field: { onChange } }) => (
            <FormItemRoot top='Тип'>
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
            </FormItemRoot>
        )}
        name='collectionType'
        control={control}
        rules={{ required: true }}
    />
);

const FormItemRoot = styled(FormItem)`
    padding: 0;
    text-align: left;
`;
