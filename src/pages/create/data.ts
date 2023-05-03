import { DynamicFieldData } from './DynamicControl';

export const fields: DynamicFieldData[] = [
    {
        title: 'Введите ответ',
        fieldName: 'textField',
        inputType: 'text',
        label: '',
        defaultValue: '',
    },
    {
        title: 'Выберите ответ',
        fieldName: 'radio',
        inputType: 'radio',
        label: '',
        options: [
            {
                id: 1,
                title: 'Выбор ответа 1',
                value: '1',
                description: 'Описание ответа 1',
            },
            {
                id: 2,
                title: 'Выбор ответа 2',
                value: '2',
                description: 'Описание ответа 2',
            },
        ],
        defaultValue: '',
    },
    {
        title: 'Выберите ответы',
        fieldName: 'checkbox',
        inputType: 'checkbox',
        label: 'Checkbox',
        options: [
            {
                id: 1,
                title: 'Выбор',
                value: '1',
                description: '',
            },
            {
                id: 2,
                title: '',
                value: '',
                description: '',
            },
            {
                id: 3,
                title: '',
                value: '',
                description: '',
            },
        ],
        defaultValue: '',
    },
];
