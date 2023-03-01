import { List, SimpleCell, Text } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { useRouter } from '@happysanta/router';

import { PAGE_COLLECTION_ID } from '@/app/router';
import type { TaskType } from '@/app/types';

import { CollectionHistorySkeleton } from './skeleton';

interface CollectionHistoryProps {
    collections: TaskType[];
}

export const CollectionHistory: FC<CollectionHistoryProps> = ({ collections }) => {
    const router = useRouter();

    return (
        <CollectionHistoryWrapper>
            <List>
                {collections?.length ? (
                    collections.slice(-3).map(({ id, name, status }) => (
                        <SimpleCell
                            key={id}
                            after={
                                status === 'DONE' ? (
                                    <GrayText>завершен</GrayText>
                                ) : (
                                    <GreenText>открыт</GreenText>
                                )
                            }
                            subtitle='Прислали ??'
                            onClick={() =>
                                router.pushPage(PAGE_COLLECTION_ID, { collectionId: `${id}` })
                            }
                        >
                            {name}
                        </SimpleCell>
                    ))
                ) : (
                    <CollectionHistorySkeleton />
                )}
            </List>
        </CollectionHistoryWrapper>
    );
};

const GreenText = styled(Text)`
    color: var(--vkui--color_text_positive);
`;

const GrayText = styled(Text)`
    color: var(--vkui--color_text_secondary);
`;

const CollectionHistoryWrapper = styled.div`
    min-height: 190px;
`;
