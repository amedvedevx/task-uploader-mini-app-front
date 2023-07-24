import type { FC } from 'react';
import { useState } from 'react';
import { Div, FormLayout, Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PAGE_COLLECTION_HOME, PAGE_COLLECTION_ID, PANEL_CREATE_COLLECTION } from '@/app/router';
import { useCreateTaskMutation } from '@/api';
import { FooterWithButton } from '@/components';
import type { SnackBarText } from '@/app/types';
import { SnackBarMessage } from '@/components/SnackBarMessage';

import { CreateInput } from './components';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);
// matches string that not contain only spec`characters
const regexPattern =
    /(?!^[`|~|!|@|#|$|%|^|&|*|(|)|+|=|[|{|\]|}|||\\|'|<|,|.|>|?|/|""|;|:|' ']+$)^.+$/g;

type FormValues = {
    collectionName: string;
    collectionDescription: string;
};

interface CreatePageProps {
    id?: string;
}

export const CreatePage: FC<CreatePageProps> = () => {
    const router = useRouter();

    const [createTask, { isLoading: isTaskCreating, isError: isTaskError }] =
        useCreateTaskMutation();

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

    const [snackbarText, setSnackbarText] = useState<SnackBarText>(null);

    const onSubmit = async (data: { collectionName: string; collectionDescription: string }) => {
        if (errors.root) {
            setSnackbarText({ type: 'error', text: 'Не удалось создать сбор' });

            return;
        }
        const payload = {
            name: data.collectionName.trim(),
            description: data.collectionDescription.trim(),
            unlimited: true,
            deadLine: deadLineDate,
        };

        const { id } = await createTask(payload).unwrap();

        router.pushPage(PAGE_COLLECTION_ID, { collectionId: id });
    };

    const goBack = () => {
        router.pushPage(PAGE_COLLECTION_HOME);
    };

    if (isTaskError) {
        setSnackbarText({ type: 'error', text: 'Не удалось создать сбор' });
    }

    return (
        <Panel
            id={PANEL_CREATE_COLLECTION}
            data-automation-id='create-page-panel'
        >
            <PanelHeader
                separator={false}
                before={
                    <PanelHeaderBack
                        data-automation-id='create-page-backButton'
                        onClick={goBack}
                    />
                }
            />

            <CreateContainer>
                <FormWrapper>
                    <PlaceholderWidth
                        header='Укажите название и описание сбора'
                        data-automation-id='create-page-placeholder'
                    >
                        Так вы сможете быстрее находить его среди всех сборов
                    </PlaceholderWidth>

                    <FormLayoutWidth
                        data-automation-id='create-page-form'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <CreateInput
                            required
                            control={control}
                            label='Название *'
                            placeholder='Копия справок о прививке'
                            inputName='collectionName'
                            pattern={regexPattern}
                        />

                        <CreateInput
                            control={control}
                            label='Описание'
                            placeholder='Присылайте медицинские справки о прививках до 3 апреля'
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
                        text: 'Сохранить',
                        onClick: handleSubmit(onSubmit),
                        loading: isTaskCreating,
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
    padding-top: calc(15vh - var(--vkui--size_panel_header_height--regular));
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
