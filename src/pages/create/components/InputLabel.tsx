import type { FC } from 'react';
import styled from 'styled-components';

interface InputLabelProps {
    label: string;
    curLength: number;
}

export const InputLabel: FC<InputLabelProps> = ({ label, curLength }) => (
    <LabelWrapper>
        <span>{label}</span>

        <span> {`${curLength} / 48`}</span>
    </LabelWrapper>
);

const LabelWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
