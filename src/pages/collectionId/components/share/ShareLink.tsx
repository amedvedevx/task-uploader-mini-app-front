import type { FC } from 'react';
import { useState } from 'react';
import { Button, Image, Placeholder } from '@vkontakte/vkui';
import { Icon20ShareExternalOutline } from '@vkontakte/icons';
import styled from 'styled-components';

import PeaopleIcon from '@/assets/peopleIcon.svg';

import { Snackbar } from './components';

interface ShareLinkProps {
    collectionId: string;
}

export const ShareLink: FC<ShareLinkProps> = ({ collectionId }) => {
    const [snackbar, setSnackbar] = useState(null);

    const openSnackbar = () => {
        if (snackbar) return;
        setSnackbar((): any => <Snackbar onClose={() => setSnackbar(null)} />);
    };

    // const createLink = (id: string) => {
    //     return
    // }

    return (
        <>
            <ShareLinkContainer>
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
                            Скопировать ссылку на сбор
                        </Button>
                    }
                >
                    Отправьте её в групповой чат или пользователю
                </Placeholder>
            </ShareLinkContainer>

            {snackbar}
        </>
    );
};

const ShareLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`;

const ImageWithSizes = styled(Image)`
    width: 170px !important;
    height: 100px !important;
    background-color: transparent;
`;
