import type { FC } from 'react';
import { useState } from 'react';
import { Button, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PAGE_CREATE_COLLECTION } from '@/app/router';

import { CreateInput } from './components';

export const CreatePage: FC = () => {
    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    const [collectionName, setCollectionName] = useState<string>('');

    return (
        <Panel id={PAGE_CREATE_COLLECTION}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            />

            <Placeholder
                header='Придумайте название'
                action={
                    <Button
                        stretched
                        size='l'
                        onClick={() => router.pushPage(PAGE_COLLECTION_ID)}
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
