import type { FC } from 'react';
import { useState } from 'react';
import { Div, FormLayout, Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PAGE_COLLECTION_ID, PANEL_CREATE_COLLECTION } from '@/app/router';
import { useCreateSubTaskMutation, useCreateTaskMutation } from '@/api';
import { FooterWithButton } from '@/components';
import type { SnackBarText } from '@/app/types';
import { SnackBarMessage } from '@/components/SnackBarMessage';

import { CreateInput } from './components';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);

type FormValues = {
    collectionName: string;
    collectionDescription: string;
};

export const CreatePage: FC = () => {
    const router = useRouter();

    const [createTask, { isLoading: isTaskCreating, isError: isTaskError }] =
        useCreateTaskMutation();
    const [createSubTask, { isLoading: isSubTaskCreating, isError: isSubTaskError }] =
        useCreateSubTaskMutation();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            collectionName: '',
            collectionDescription: '',
        },
    });

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const onSubmit = async (data: { collectionName: string; collectionDescription: string }) => {
        if (errors.root) {
            setSnackbarText({ type: 'error', text: 'Не удалось создать сбор' });

            return;
        }
        const payload = {
            name: data.collectionName,
            description: data.collectionDescription,
            unlimited: true,
            deadLine: deadLineDate,
        };

        const { taskId } = await createTask(payload).unwrap();

        const payloadSubTask = {
            rows: [
                {
                    name: `Подзадание 1 задания ${data.collectionName}`,
                    description: `Описание подзадания 1`,
                    sortOrder: 1,
                    subTaskType: 'FILE',
                },
            ],
        };
        await createSubTask({ taskId, payload: payloadSubTask });
        router.pushPage(PAGE_COLLECTION_ID, { collectionId: taskId });
    };

    const goBack = () => {
        router.popPage();
    };

    if (isTaskError || isSubTaskError) {
        setSnackbarText({ type: 'error', text: 'Не удалось создать сбор' });
    }

    return (
        <Panel id={PANEL_CREATE_COLLECTION}>
            <PanelHeader
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            />

            <CreateContainer>
                <FormWrapper>
                    <PlaceholderWidth header='Придумайте название'>
                        Название поможет вам быстрее найти сбор среди других заданий
                    </PlaceholderWidth>

                    <FormLayoutWidth onSubmit={handleSubmit(onSubmit)}>
                        <CreateInput
                            required
                            control={control}
                            label='Название*'
                            placeholder='Например: "Документы в лагерь"'
                            inputName='collectionName'
                        />

                        <CreateInput
                            control={control}
                            label='Описание задания'
                            placeholder='Например: "до 3 апреля необходимо прислать документы в лагерь о прививках"'
                            inputName='collectionDescription'
                        />
                    </FormLayoutWidth>
                </FormWrapper>
            </CreateContainer>

            {snackbarText && (
                <SnackBarMessage
                    snackbarText={snackbarText}
                    setSnackbarText={setSnackbarText}
                />
            )}

            <FooterWithButton
                options={[
                    {
                        text: 'Готово',
                        onClick: handleSubmit(onSubmit),
                        loading: isTaskCreating || isSubTaskCreating,
                        disabled: watch('collectionName').length === 0,
                    },
                ]}
            />
        </Panel>
    );
};

const CreateContainer = styled(Div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 15vh;
`;

const FormWrapper = styled.div`
    max-width: 320px;
    margin-bottom: 68px;
`;

const PlaceholderWidth = styled(Placeholder)`
    .vkuiPlaceholder__in {
        padding: unset;
    }
    .vkuiPlaceholder__header + .vkuiPlaceholder__text {
        margin-top: 12px;
    }
`;

const FormLayoutWidth = styled(FormLayout)`
    width: 100%;
    margin-top: 30px;
`;
