/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from 'react';
import { Image, Link } from '@vkontakte/vkui';
import styled from 'styled-components';
import { useRouter } from '@happysanta/router';

import PeaopleIcon from '@/assets/peopleIcon.svg';
import { copyUploadLinkToClipboard } from '@/lib/utils';
import { PAGE_ADD_MEMBERS } from '@/app/router';
import { PlaceholderWidth } from '@/pages/home/HomePage';

interface ShareLinkProps {
    collectionId: string;
    setSnackbarText: (arg: string) => void;
}

export const ShareLink: FC<ShareLinkProps> = ({ collectionId, setSnackbarText }) => {
    const router = useRouter();
    const copyLink = (copyText: string) => {
        copyUploadLinkToClipboard(copyText);
        setSnackbarText('Ссылка скопирована');
    };

    return (
        <ShareLinkContainer>
            <PlaceholderWidth
                icon={
                    <ImageWithSizes
                        borderRadius='s'
                        withBorder={false}
                        src={PeaopleIcon}
                    />
                }
            >
                <Link onClick={() => router.pushPage(PAGE_ADD_MEMBERS, { collectionId })}>
                    Добавьте участников
                </Link>

                {` в задание по сбору файлов или `}

                <Link onClick={() => copyLink(collectionId)}>поделитесь ссылкой</Link>

                {` с нужными пользователями`}
            </PlaceholderWidth>
        </ShareLinkContainer>
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
    width: 160px !important;
    height: 94px !important;
    background-color: transparent;
`;
