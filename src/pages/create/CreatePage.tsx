import type { FC } from 'react';
import { Button, FormLayout, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

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

            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <PlaceholderCreate
                    header='Придумайте название'
                    action={
                        <Button
                            stretched
                            type='submit'
                            size='l'
                            onClick={() => router.pushPage(PAGE_COLLECTION_ID, { id: '1' })}
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
                </PlaceholderCreate>
            </FormLayout>
        </Panel>
    );
};

const PlaceholderCreate = styled(Placeholder)`
    .vkuiPlaceholder__in {
        max-width: 560px;
        width: 100%;
    }
`;
