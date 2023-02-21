import type { FC } from 'react';
import { Input } from '@vkontakte/vkui';
import styled from 'styled-components';

interface CreateInputProps {
    label: string;
    placeholder: string;
    value: string | number | undefined;
    onChange: (value: React.SetStateAction<string>) => void;
}

export const CreateInput: FC<CreateInputProps> = ({ label, value, placeholder, onChange }) => (
    <CreateInputContainer>
        <CreateInputLabel>
            <div>{label}</div>

            <div>0 / 48</div>
        </CreateInputLabel>

        <Input
            type='text'
            value={value}
            placeholder={placeholder}
            onChange={(e): void => onChange(e.target.value)}
        />
    </CreateInputContainer>
);

const CreateInputContainer = styled.div`
    margin-bottom: 24px;
`;

const CreateInputLabel = styled.div`
    display: flex;
    justify-content: space-between;
    color: var(--vkui--color_text_subhead);
    overflow: hidden;
    padding-bottom: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
`;
