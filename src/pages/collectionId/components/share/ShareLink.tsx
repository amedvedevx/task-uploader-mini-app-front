import type { FC } from 'react';
import { useState } from 'react';
import { Button, Image, Placeholder, Search } from '@vkontakte/vkui';
import { Icon20ShareExternalOutline } from '@vkontakte/icons';
import styled from 'styled-components';

import PeaopleIcon from '@/assets/peopleIcon.svg';

import { Snackbar } from './components';
import { FooterWithButton } from '../../../components';

export const ShareLink: FC = () => {
    const [snackbar, setSnackbar] = useState(null);

    const openSnackbar = () => {
        if (snackbar) return;
        setSnackbar((): any => <Snackbar onClose={() => setSnackbar(null)} />);
    };

    return (
        <>
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
        </>
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
