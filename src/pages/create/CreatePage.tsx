import type { FC } from 'react';
import { Div, FormLayout, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_ADD_MEMBERS, PAGE_COLLECTION_ID, PANEL_CREATE_COLLECTION } from '@/app/router';
import { useCreateTaskMutation } from '@/api';

import { CreateInput } from './components';
import { FooterWithButton } from '../components';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);

type FormValues = {
    collectionName: string;
    collectionDescription: string;
};

export const CreatePage: FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            collectionName: '',
            collectionDescription: '',
        },
    });
    const router = useRouter();

    const [createTask] = useCreateTaskMutation();

    const onSubmit = async (data: { collectionName: string; collectionDescription: string }) => {
        if (errors.root) return;
        const payload = {
            name: data.collectionName,
            description: data.collectionDescription,
            unlimited: true,
            deadLine: deadLineDate,
        };

        const { taskId } = await createTask(payload).unwrap();
        router.pushPage(PAGE_ADD_MEMBERS, { collectionId: taskId });
    };

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PANEL_CREATE_COLLECTION}>
            <PanelHeaderCentered
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
                            placeholder='Например: "до 3 апреля необходимо прислать документы в лагер о прививках"'
                            inputName='collectionDescription'
                        />
                    </FormLayoutWidth>
                </FormWrapper>
            </CreateContainer>

            <FooterWithButton
                primary
                text='Готово'
                onClick={handleSubmit(onSubmit)}
            />
        </Panel>
    );
};

const CreateContainer = styled(Div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
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
        margin-top: 20px;
    }
`;

const FormLayoutWidth = styled(FormLayout)`
    width: 100%;
    margin-top: 30px;
`;
