import {
    Button,
    Group,
    Header,
    Image,
    List,
    Panel,
    Text,
    Placeholder,
    Separator,
    SimpleCell,
    Spacing,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useRouter } from '@happysanta/router';
import styled from 'styled-components';

import { PAGE_COLLECTION_HOME, PAGE_CREATE_COLLECTION } from '@/app/router';
import DocAndImageIcon from '@/assets/docAndImgIcon.svg';

const collectionsMock = [
    { id: 1, title: 'Документы в лагерь', isOpen: false, completion: 2 },
    { id: 2, title: 'Справки', isOpen: true, completion: 21 },
    { id: 3, title: 'Домашнее задание', isOpen: true, completion: 18 },
];

export const HomePage: FC = () => {
    const router = useRouter();

    return (
        <Panel id={PAGE_COLLECTION_HOME}>
            <CollectionsContainer>
                <Placeholder
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

                <GroupWide
                    header={<Header mode='primary'>История</Header>}
                    mode='plain'
                >
                    <Spacing size={36}>
                        <Separator />
                    </Spacing>

                    <List>
                        {collectionsMock.map(({ id, title, completion, isOpen }) => (
                            <SimpleCell
                                key={id}
                                after={
                                    isOpen ? (
                                        <GrayText>завершен</GrayText>
                                    ) : (
                                        <GreenText>открыт</GreenText>
                                    )
                                }
                                subtitle={`Прислали ${completion}`}
                            >
                                {title}
                            </SimpleCell>
                        ))}
                    </List>
                </GroupWide>
            </CollectionsContainer>
        </Panel>
    );
};

const CollectionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const GroupWide = styled(Group)`
    max-width: 560px;
    width: 100%;
`;

const ImageWithSizes = styled(Image)`
    width: 140px !important;
    height: 100px !important;
    background-color: transparent;
`;

const GreenText = styled(Text)`
    color: var(--vkui--color_text_positive);
`;

const GrayText = styled(Text)`
    color: var(--vkui--color_text_secondary);
`;
