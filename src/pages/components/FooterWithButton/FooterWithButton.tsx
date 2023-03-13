import { Button, FixedLayout, Separator } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';
import { useRouter } from '@happysanta/router';

import { useUpdateTaskMutation } from '@/api';
import { PAGE_COLLECTION_HOME } from '@/app/router';

interface FooterWithButtonProps {
    collectionId: string;
    isCompleteCollection: boolean;
    text: string;
}

export const FooterWithButton: FC<FooterWithButtonProps> = ({
    text,
    collectionId,
    isCompleteCollection,
}) => {
    const router = useRouter();

    const [updateTask] = useUpdateTaskMutation();

    const handleUpdateTask = async (id: string) => {
        const payload = {
            fields: [{ fieldName: 'status', value: 'DONE' }],
        };

        await updateTask({ taskId: id, payload });

        router.pushPage(PAGE_COLLECTION_HOME);
    };

    return (
        <FixedLayout
            filled
            vertical='bottom'
        >
            <Separator wide />

            <ActionWrapper>
                <Button
                    stretched
                    size='l'
                    mode='secondary'
                    appearance='negative'
                    disabled={isCompleteCollection}
                    onClick={(): Promise<void> => handleUpdateTask(collectionId)}
                >
                    {text}
                </Button>
            </ActionWrapper>
        </FixedLayout>
    );
};

const ActionWrapper = styled.div`
    padding: 16px 20px;
`;
