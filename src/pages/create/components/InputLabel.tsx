import type { FC } from 'react';
import styled from 'styled-components';

interface InputLabelProps {
    label: string;
    curLength: number;
    maxLength: number;
}

export const InputLabel: FC<InputLabelProps> = ({ label, curLength, maxLength }) => (
    <LabelWrapper>
        <span>{label}</span>

        <span> {`${curLength} / ${maxLength}`}</span>
    </LabelWrapper>
);

const LabelWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
