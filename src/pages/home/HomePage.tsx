import {
    Button,
    Group,
    Header,
    Image,
    Panel,
    Placeholder,
    Separator,
    Spacing,
    Div,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PAGE_CREATE_COLLECTION, PANEL_COLLECTION_HOME } from '@/app/router';
import DocAndImageIcon from '@/assets/docAndImgIcon.svg';
import { useGetTasksQuery } from '@/api';

import { CollectionHistory } from './components/CollectionHistory';

export const HomePage: FC = () => {
    const router = useRouter();

    const { data = { tasks: [] }, isLoading } = useGetTasksQuery({});

    const { tasks } = data;

    return (
        <Panel id={PANEL_COLLECTION_HOME}>
            <CollectionsContainer $isTasksExist={tasks.length > 0}>
                <PlaceholderWidth
                    icon={
                        <ImageWithSizes
                            borderRadius='s'
                            withBorder={false}
                            src={DocAndImageIcon}
                        />
                    }
                    header='Создавайте централизованный сбор файлов и документов'
                    action={
                        <Button
                            stretched
                            size='m'
                            onClick={() => router.pushPage(PAGE_CREATE_COLLECTION)}
                        >
                            Создать
                        </Button>
                    }
                />

                {tasks.length > 0 && (
                    <GroupWide
                        header={<Header mode='primary'>История</Header>}
                        mode='plain'
                    >
                        <Spacing size={32}>
                            <Separator />
                        </Spacing>

                        <CollectionHistory
                            collections={tasks}
                            isLoading={isLoading}
                        />
                    </GroupWide>
                )}
            </CollectionsContainer>
        </Panel>
    );
};

const CollectionsContainer = styled(Div)<{ $isTasksExist: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;

    padding-top: ${({ $isTasksExist }) => ($isTasksExist ? '12vh' : 'unset')};
`;

export const PlaceholderWidth = styled(Placeholder)`
    max-width: 372px;
    .vkuiPlaceholder__in {
        padding: 48px 0px;
    }
`;

const GroupWide = styled(Group)`
    max-width: 372px;
    width: 100%;
    .vkuiGroup__inner {
        padding: unset;
    }
`;

const ImageWithSizes = styled(Image)`
    width: 140px !important;
    height: 100px !important;
    background-color: transparent;
`;
