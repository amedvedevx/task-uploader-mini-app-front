import type { FC } from 'react';
import {
    Avatar,
    ButtonGroup,
    CellButton,
    FixedLayout,
    Search,
    Separator,
    Spacing,
} from '@vkontakte/vkui';
import { Icon24Linked, Icon24DownloadOutline } from '@vkontakte/icons';

import type { TaskResults } from '@/app/types';

import { CollectionMembers } from './components/CollectionMembers';
import { useDownloadFile, useSearch } from '../../hooks';

interface SentListProps {
    collection: TaskResults[];
    collectionId: string;
    shareLink: () => void;
}

export const SentList: FC<SentListProps> = ({ collection, collectionId, shareLink }) => {
    const { download } = useDownloadFile(collectionId);

    const testee = collection.map((el) => el.testee);

    const { filteredData, search, changeSearch } = useSearch(testee, 'firstName');

    return (
        <>
            <FixedLayout
                filled
                vertical='top'
            >
                <Search
                    value={search}
                    onChange={changeSearch}
                />

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
                        onClick={() => shareLink()}
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
                        onClick={() => download()}
                    >
                        Скачать все файлы
                    </CellButton>
                </ButtonGroup>

                <Spacing size={36}>
                    <Separator />
                </Spacing>
            </FixedLayout>

            <CollectionMembers collection={filteredData} />
        </>
    );
};
