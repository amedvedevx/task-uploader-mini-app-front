import type { FC } from 'react';
import { Button, Image, Placeholder } from '@vkontakte/vkui';
import { Icon24CopyOutline } from '@vkontakte/icons';
import styled from 'styled-components';

import PeaopleIcon from '@/assets/peopleIcon.svg';

interface ShareLinkProps {
    shareLink: () => void;
}

export const ShareLink: FC<ShareLinkProps> = ({ shareLink }) => (
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
                    before={<Icon24CopyOutline />}
                    size='l'
                    onClick={() => {
                        shareLink();
                    }}
                >
                    Скопировать ссылку на сбор
                </Button>
            }
        >
            Отправьте её в групповой чат или пользователю
        </Placeholder>
    </ShareLinkContainer>
);

const ShareLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`;

const ImageWithSizes = styled(Image)`
    width: 160px !important;
    height: 94px !important;
    background-color: transparent;
`;
