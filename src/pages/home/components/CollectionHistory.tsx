import { List } from '@vkontakte/vkui';
import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { SnackBarText, TaskType } from '@/app/types';

import { CollectionHistorySkeleton } from './skeleton';
import { CollectionCell } from './CollectionCell';

interface CollectionHistoryProps {
    collections: TaskType[] | undefined;
    isLoading: boolean;
    setSnackbarText: React.Dispatch<React.SetStateAction<SnackBarText>>;
}

export const CollectionHistory: FC<CollectionHistoryProps> = ({
    collections,
    isLoading,
    setSnackbarText,
}) => {
    const [popout, setPopout] = useState<JSX.Element | null>(null);

    return (
        <CollectionHistoryWrapper>
            <List>
                {!isLoading && collections ? (
                    collections.map(({ id, name, status, consolidatedData }) => (
                        <CollectionCell
                            key={id}
                            id={id}
                            name={name}
                            status={status}
                            consolidatedData={consolidatedData}
                            setPopout={setPopout}
                            setSnackbarText={setSnackbarText}
                        />
                    ))
                ) : (
                    <CollectionHistorySkeleton />
                )}

                {popout}
            </List>
        </CollectionHistoryWrapper>
    );
};

const CollectionHistoryWrapper = styled.div`
    min-height: 190px;
`;
