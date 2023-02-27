import { List, SimpleCell, Text } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { useRouter } from '@happysanta/router';

import { PAGE_COLLECTION_ID } from '@/app/router';

import { CollectionHistorySkeleton } from './skeleton';

type Collection = {
    id: number;
    title: string;
    isOpen: boolean;
    completion: number;
};

interface CollectionHistoryProps {
    collections: Collection[];
}

export const CollectionHistory: FC<CollectionHistoryProps> = ({ collections }) => {
    const router = useRouter();

    return (
        <List>
            {collections?.length ? (
                collections.slice(-3).map(({ id, title, completion, isOpen }) => (
                    <SimpleCell
                        key={id}
                        after={
                            isOpen ? <GrayText>завершен</GrayText> : <GreenText>открыт</GreenText>
                        }
                        subtitle={`Прислали ${completion}`}
                        onClick={() =>
                            router.pushPage(PAGE_COLLECTION_ID, { collectionId: `${id}` })
                        }
                    >
                        {title}
                    </SimpleCell>
                ))
            ) : (
                <CollectionHistorySkeleton />
            )}
        </List>
    );
};

const GreenText = styled(Text)`
    color: var(--vkui--color_text_positive);
`;

const GrayText = styled(Text)`
    color: var(--vkui--color_text_secondary);
`;
