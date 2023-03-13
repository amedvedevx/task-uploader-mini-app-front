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
            <CollectionsContainer>
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

                {tasks && (
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

const CollectionsContainer = styled(Div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`;

const PlaceholderWidth = styled(Placeholder)`
    .vkuiPlaceholder__header {
        max-width: 372px;
    }
    .vkuiPlaceholder__in {
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 24px;
    }
    .vkuiPlaceholder__icon {
        margin: unset;
    }
    .vkuiPlaceholder__action:not(:first-child) {
        width: 100%;
        margin: unset;
    }
`;

const GroupWide = styled(Group)`
    max-width: 372px;
    width: 100%;
`;

const ImageWithSizes = styled(Image)`
    width: 140px !important;
    height: 100px !important;
    background-color: transparent;
`;
