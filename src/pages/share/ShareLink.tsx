import type { FC } from 'react';
import { useState } from 'react';
import { Button, Image, Panel, PanelHeaderBack, Placeholder, Search } from '@vkontakte/vkui';
import { Icon20ShareExternalOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import PeaopleIcon from '@/assets/peopleIcon.svg';
import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PAGE_COLLECTION_ID } from '@/app/router';

import { Snackbar } from './components';
import { FooterWithButton } from '../components';

export const ShareLink: FC = () => {
    const [snackbar, setSnackbar] = useState(null);

    const openBaseWithAction = () => {
        if (snackbar) return;
        setSnackbar((): any => <Snackbar onClose={() => setSnackbar(null)} />);
    };

    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PAGE_COLLECTION_ID}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                Документы в лагерь
            </PanelHeaderCentered>

            <Search />

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

            <FooterWithButton text='Завершить сбор' />

            {snackbar}
        </Panel>
    );
};

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
