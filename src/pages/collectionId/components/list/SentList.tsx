import type { FC } from 'react';
import {
    Avatar,
    Button,
    CellButton,
    Group,
    Header,
    List,
    Search,
    Separator,
    SimpleCell,
    Spacing,
} from '@vkontakte/vkui';
import { Icon24Linked, Icon24DownloadOutline } from '@vkontakte/icons';

import { FooterWithButton } from '../../../components';

interface SentListProps {
    sentListMock: Array<Record<string, unknown>>;
}

export const SentList: FC<SentListProps> = ({ sentListMock }) => (
    <>
        <Group
            padding='s'
            separator='hide'
            mode='plain'
        >
            <Search />

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

            <Spacing size={36}>
                <Separator />
            </Spacing>
        </Group>

        <Group
            padding='s'
            separator='hide'
            mode='plain'
            header={<Header mode='tertiary'>Прислали 2 участника</Header>}
        >
            <List>
                {sentListMock.map(({ id, name, icon }) => (
                    <SimpleCell
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
                    </SimpleCell>
                ))}
            </List>
        </Group>

        <FooterWithButton text='Завершить сбор' />
    </>
);
