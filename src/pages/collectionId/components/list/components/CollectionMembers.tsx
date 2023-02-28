import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell } from '@vkontakte/vkui';
import styled from 'styled-components';

import { SkeletonMembers } from './SkeletonMembers';

type Collection = {
    id: number;
    name: string;
    icon: string;
};

interface CollectionMembersProps {
    collection: Collection[];
}

export const CollectionMembers: FC<CollectionMembersProps> = ({ collection }) => (
    <>
        {collection.length ? (
            <GroupWide
                header={<HeaderList>{`Прислали ${collection.length} участника`}</HeaderList>}
                padding='s'
                mode='plain'
            >
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
            </GroupWide>
        ) : (
            <SkeletonMembers />
        )}
    </>
);

const GroupWide = styled(Group)`
    .vkuiGroup__inner {
        padding: 0 !important;
    }
`;

const HeaderList = styled.div`
    padding: 0 16px;
    margin-bottom: 16px;
    font-weight: 400;
    font-size: 14px;
    color: var(--vkui--color_text_subhead);
`;

const Members = styled(SimpleCell)`
    margin-bottom: 16px;
`;
