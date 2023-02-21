import type { FC } from 'react';
import { useState } from 'react';
import { Button, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';

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

            <Placeholder
                header='Придумайте название'
                action={
                    <Button
                        stretched
                        size='l'
                    >
                        Продолжить
                    </Button>
                }
            >
                <CreateInput
                    label='Название сбора'
                    placeholder='Например «Документы для поездки»'
                    value={collectionName}
                    onChange={setCollectionName}
                />
            </Placeholder>
        </Panel>
    );
};
