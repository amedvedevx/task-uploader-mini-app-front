import { useRouter } from '@happysanta/router';
import { Icon24Add } from '@vkontakte/icons';
import { CellButton, Avatar } from '@vkontakte/vkui';
import type { FC } from 'react';

import { PAGE_ADD_MEMBERS } from '@/app/router';

interface AddTesteesProps {
    collectionId: string;
}

export const AddTestees: FC<AddTesteesProps> = ({ collectionId }) => {
    const router = useRouter();

    return (
        <CellButton
            before={
                <Avatar
                    withBorder={false}
                    size={40}
                >
                    <Icon24Add />
                </Avatar>
            }
            onClick={() => router.pushPage(PAGE_ADD_MEMBERS, { collectionId })}
        >
            Добавить участников
        </CellButton>
    );
};
