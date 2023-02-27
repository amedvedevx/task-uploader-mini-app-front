import type { FC } from 'react';
import {
    Avatar,
    Button,
    CellButton,
    Group,
    Header,
    List,
    Panel,
    PanelHeaderBack,
    Search,
    Separator,
    SimpleCell,
    Spacing,
} from '@vkontakte/vkui';
import { Icon24Linked, Icon24DownloadOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import { PanelHeaderCentered } from '@/components/PanelHeaderCentered';
import { PANEL_COLLECTION_LIST } from '@/app/router';
import Avatar1 from '@/assets/avatar1.svg';
import Avatar2 from '@/assets/avatar2.svg';

import { FooterWithButton } from '../components';

const sentListMock = [
    { id: 1, name: 'Алексей Чайников', icon: Avatar1 },
    { id: 2, name: 'Иван Черный', icon: Avatar2 },
];

export const SentList: FC = () => {
    const router = useRouter();

    const goBack = () => {
        router.popPage();
    };

    return (
        <Panel id={PANEL_COLLECTION_LIST}>
            <PanelHeaderCentered
                separator={false}
                before={<PanelHeaderBack onClick={goBack} />}
            >
                Документы в лагерь
            </PanelHeaderCentered>

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
        </Panel>
    );
};
