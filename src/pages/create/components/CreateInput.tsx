import type { FC } from 'react';
import { FormItem, Input } from '@vkontakte/vkui';
import styled from 'styled-components';

interface CreateInputProps {
    label: string;
    placeholder: string;
    value: string | number | undefined;
    onChange: (value: React.SetStateAction<string>) => void;
}

export const CreateInput: FC<CreateInputProps> = ({ label, value, placeholder, onChange }) => (
    <CreateInputContainer>
        <FormItem
            top={label}
            style={{ padding: 0 }}
        >
            <Input
                type='text'
                value={value}
                placeholder={placeholder}
                onChange={(e): void => onChange(e.target.value)}
            />
        </FormItem>
    </CreateInputContainer>
);

const CreateInputContainer = styled.div`
    margin-bottom: 24px;
`;
