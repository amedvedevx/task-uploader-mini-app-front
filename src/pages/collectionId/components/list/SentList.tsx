import type { FC } from 'react';
import { Avatar, ButtonGroup, CellButton, Separator, Spacing } from '@vkontakte/vkui';
import { Icon24Linked, Icon24DownloadOutline } from '@vkontakte/icons';

import type { TaskResults } from '@/app/types';

import { CollectionMembers } from './components/CollectionMembers';

interface SentListProps {
    collection: TaskResults[];
}

export const SentList: FC<SentListProps> = ({ collection }) => (
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

        <CollectionMembers collection={collection} />
    </>
);
