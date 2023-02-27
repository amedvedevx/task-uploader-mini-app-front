import type { FC } from 'react';
import { Avatar, Button, List, SimpleCell } from '@vkontakte/vkui';
import styled from 'styled-components';

type Collection = {
    id: number;
    name: string;
    icon: string;
};

interface CollectionMembersProps {
    collection: Collection[];
}

export const CollectionMembers: FC<CollectionMembersProps> = ({ collection }) => (
    <List>
        {collection.map(({ id, name, icon }) => (
            <Members
                key={id}
                before={
                    <Avatar
                        src={icon}
                        size={40}
                    />
                }
                after={
                    <Button
                        appearance='accent'
                        size='s'
                        mode='secondary'
                    >
                        Скачать
                    </Button>
                }
            >
                {name}
            </Members>
        ))}
    </List>
);

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
