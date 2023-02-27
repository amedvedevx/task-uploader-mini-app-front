import type { FC } from 'react';
import { Avatar, ButtonGroup, CellButton, Group, Separator, Spacing } from '@vkontakte/vkui';
import { Icon24Linked, Icon24DownloadOutline } from '@vkontakte/icons';
import styled from 'styled-components';

import { CollectionMembers } from './components/CollectionMembers';

interface SentListProps {
    sentListMock: { id: number; name: string; icon: string }[];
}

export const SentList: FC<SentListProps> = ({ sentListMock }) => (
    <>
        <ButtonGroup
            mode='vertical'
            gap='s'
        >
            <CellButton
                before={
                    <Avatar
                        withBorder={false}
                        size={40}
                    >
                        <Icon24Linked />
                    </Avatar>
                }
            >
                Поделиться ссылкой на сбор
            </CellButton>

            <CellButton
                before={
                    <Avatar
                        withBorder={false}
                        size={40}
                    >
                        <Icon24DownloadOutline />
                    </Avatar>
                }
            >
                Скачать все файлы
            </CellButton>
        </ButtonGroup>

        <Spacing size={36}>
            <Separator />
        </Spacing>

        <GroupWide
            header={<HeaderList>Прислали 2 участника</HeaderList>}
            padding='s'
            mode='plain'
        >
            <CollectionMembers collection={sentListMock} />
        </GroupWide>
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
