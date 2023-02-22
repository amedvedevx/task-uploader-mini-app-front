import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
    Button,
    Image,
    Panel,
    PanelHeaderBack,
    Placeholder,
    Separator,
    Spacing,
} from '@vkontakte/vkui';
import { Icon20ShareExternalOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import PeaopleIcon from '@/assets/peopleIcon.svg';
import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_ID } from '@/app/router';

import { Snackbar } from './components/Snackbar/Snackbar';
import { InputSearch } from './components/InputSearch';

export const CollectionLink: FC = () => {
    const { control } = useForm({
        defaultValues: {
            search: '',
        },
    });

    const [snackbar, setSnackbar] = useState(null);

    const openBaseWithAction = () => {
        if (snackbar) return;
        setSnackbar((): any => <Snackbar onClose={() => setSnackbar(null)} />);
    };

    useEffect(() => {
        openBaseWithAction();
    }, []);

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PANEL_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                Документы в лагерь
            </PanelHeaderCentered>

            <ActionWrapper>
                <InputSearch
                    control={control}
                    placeholder='Поиск'
                />
            </ActionWrapper>

            <CollectionLinkContainer>
                <Placeholder
                    header='Ссылка создана'
                    icon={
                        <ImageWithSizes
                            borderRadius='s'
                            withBorder={false}
                            src={PeaopleIcon}
                        />
                    }
                    action={
                        <Button
                            before={<Icon20ShareExternalOutline />}
                            size='l'
                        >
                            Поделиться ссылкой
                        </Button>
                    }
                >
                    Отправьте её в групповой чат или пользователю
                </Placeholder>
            </CollectionLinkContainer>

            <Separator wide />

            <Spacing size={16} />

            <ActionWrapper>
                <Button
                    stretched
                    size='l'
                    mode='secondary'
                    appearance='negative'
                >
                    Завешрить сбор
                </Button>
            </ActionWrapper>

            <Spacing size={16} />

            {snackbar}
        </Panel>
    );
};

const ActionWrapper = styled.div`
    padding: 0 20px;
`;

const CollectionLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const ImageWithSizes = styled(Image)`
    width: 170px !important;
    height: 100px !important;
    background-color: transparent;
`;
