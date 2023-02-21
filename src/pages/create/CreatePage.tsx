import type { FC } from 'react';
import { Button, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PAGE_CREATE_COLLECTION } from '@/app/router';

import { CreateInput } from './components';

export const CreatePage: FC = () => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            collectionName: '',
        },
    });

    const onSubmit = (data: { collectionName: string }) => console.log(data);

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PAGE_CREATE_COLLECTION}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Placeholder
                    header='Придумайте название'
                    action={
                        <Button
                            stretched
                            type='submit'
                            size='l'
                            onClick={() => router.pushPage(PAGE_COLLECTION_ID)}
                        >
                            Продолжить
                        </Button>
                    }
                >
                    <CreateInput
                        control={control}
                        label='Название'
                        placeholder='Документы в лагерь'
                    />
                </Placeholder>
            </form>
        </Panel>
    );
};
