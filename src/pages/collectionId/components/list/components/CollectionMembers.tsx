import type { FC } from 'react';
import { Avatar, Button, Group, List, SimpleCell } from '@vkontakte/vkui';
import styled from 'styled-components';

import type { TaskResults } from '@/app/types';

import { SkeletonMembers } from './SkeletonMembers';

interface CollectionMembersProps {
    collection: TaskResults[];
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
                    {collection.map(({ id, testee }) => (
                        <Members
                            key={id}
                            before={
                                <Avatar
                                    // src={icon}
                                    size={40}
                                    alt='icon'
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
                            {`${testee.firstName} ${testee.lastName}`}
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
