import type { FC } from 'react';
import { Div, FormLayout, Panel, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useForm } from 'react-hook-form';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID, PAGE_SELECT_MEMBERS, PANEL_CREATE_COLLECTION } from '@/app/router';
import { useCreateWideTaskMutation } from '@/api';

import { CreateInput } from './components';
import { FooterWithButton } from '../components';
import { CollectionType } from './components/CollectionType';

const monthIsSec = 2592000;
const deadLineDate = Math.ceil(new Date().getTime() / 1000 + monthIsSec);

export const CreatePage: FC = () => {
    const { control, handleSubmit, getValues } = useForm({
        defaultValues: {
            collectionName: '',
            collectionType: 'members',
        },
    });

    const [createWideTask] = useCreateWideTaskMutation();

    const onSubmit = async (data: { collectionName: string; collectionType: string }) => {
        const payload = {
            name: data.collectionName,
            description: `Описание - ${data.collectionName}`,
            unlimited: true,
            deadLine: deadLineDate,
        };

        if (data.collectionType === 'members' && data.collectionName.length > 0) {
            router.pushPage(PAGE_SELECT_MEMBERS);
        } else {
            const taskId: string = await createWideTask({ payload }).unwrap();
            router.pushPage(PAGE_COLLECTION_ID, { collectionId: taskId });
        }
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

            <CreateContainer>
                <FormLayoutWide onSubmit={handleSubmit(onSubmit)}>
                    <PlaceholderWidth header='Придумайте название и выберите тип сбора'>
                        <CreateInput
                            control={control}
                            label='Название'
                            placeholder='Например "Документы в лагерь"'
                        />

                        <CollectionType control={control} />
                    </PlaceholderWidth>
                </FormLayoutWide>
            </CreateContainer>

            <FooterWithButton
                primary
                text='Продолжить'
                onClick={() => onSubmit(getValues())}
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

const PlaceholderWidth = styled(Placeholder)`
    .vkuiPlaceholder__in {
        max-width: 320px;
        width: 100%;
        padding: unset;
    }
    .vkuiPlaceholder__header + .vkuiPlaceholder__text {
        margin-top: 20px;
    }
`;

const FormLayoutWide = styled(FormLayout)`
    width: 100%;
    margin-bottom: 56px;
`;
