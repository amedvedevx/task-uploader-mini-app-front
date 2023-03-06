import type { FC } from 'react';
import { Button, Div, FormLayout, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PANEL_CREATE_COLLECTION } from '@/app/router';
import { useCreateWideTaskMutation } from '@/api';
import { setCollectionHeader } from '@/api/state';

import { CreateInput } from './components';

const deadLineDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");

export const CreatePage: FC = () => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            collectionName: '',
        },
    });

    const dispatch = useDispatch();

    const [createWideTask] = useCreateWideTaskMutation();

    const onSubmit = async (data: { collectionName: string }) => {
        const payload = {
            name: data.collectionName,
            description: `Описание - ${data.collectionName}`,
            unlimited: true,
            deadLine: deadLineDate,
        };

        const taskId: number = await createWideTask({ payload }).unwrap();

        dispatch(setCollectionHeader(data.collectionName));

        router.pushPage(PAGE_COLLECTION_ID, { collectionId: `${taskId}` });
    };

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PANEL_CREATE_COLLECTION}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            />

            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <CreateContainer>
                    <PlaceholderCreate
                        header='Придумайте название'
                        action={
                            <Button
                                stretched
                                type='submit'
                                size='l'
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
                </CreateContainer>
            </FormLayout>
        </Panel>
    );
};

const CreateContainer = styled(Div)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
`;

const PlaceholderCreate = styled(Placeholder)`
    .vkuiPlaceholder__in {
        max-width: 560px;
        width: 100%;
    }
`;
