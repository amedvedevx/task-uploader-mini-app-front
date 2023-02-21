import type { FC } from 'react';
import { useState } from 'react';
import { Button, Panel, PanelHeaderBack, Title as TitleRoot } from '@vkontakte/vkui';
import styled from 'styled-components';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';

import { CreateInput } from './components';

export const CreatePage: FC = () => {
    const [collectionName, setCollectionName] = useState<string>('');

    return (
        <Panel>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack />}
            />

            <CreateWrapper>
                <div>
                    <Title level='2'>Придумайте название</Title>

                    <CreateInput
                        label='Название сбора'
                        placeholder='Например «Документы для поездки»'
                        value={collectionName}
                        onChange={setCollectionName}
                    />

                    <Button
                        stretched
                        size='l'
                    >
                        Продолжить
                    </Button>
                </div>
            </CreateWrapper>
        </Panel>
    );
};

const CreateWrapper = styled.div`
    padding: 0 94px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
`;

const Title = styled(TitleRoot)`
    text-align: center;
    margin-bottom: 30px;
`;
