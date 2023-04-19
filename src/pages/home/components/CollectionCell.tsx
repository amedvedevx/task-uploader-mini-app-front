import {
    ActionSheet,
    ActionSheetDefaultIosCloseItem,
    ActionSheetItem,
    IconButton,
    Platform,
    SimpleCell,
    Text,
    usePlatform,
} from '@vkontakte/vkui';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from '@happysanta/router';
import {
    Icon24MoreVertical,
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from '@vkontakte/icons';

import { PAGE_COLLECTION_ID } from '@/app/router';
import type {
    SnackBarText,
    TaskStatusTypesForOrganizer,
    TaskStatusTypesForTestee,
    TaskUserConsolidatedData,
} from '@/app/types';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/api';
import { Popout } from '@/components/Popout';

interface CollectionCellProps {
    id: string;
    name: string;
    status: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    consolidatedData: TaskUserConsolidatedData;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: React.Dispatch<React.SetStateAction<SnackBarText>>;
}

const payloadCloseTask = {
    fields: [{ fieldName: 'status', value: 'DONE' }],
};

export const CollectionCell: FC<CollectionCellProps> = ({
    id,
    name,
    status,
    consolidatedData,
    setPopout,
    setSnackbarText,
}) => {
    const router = useRouter();
    const platform = usePlatform();

    const [deleteTask, { error: deleteError, isLoading: deleteLoading }] = useDeleteTaskMutation();
    const [updateTask, { error: updateError, isLoading: updateLoading }] = useUpdateTaskMutation();

    const baseTargetRef = useRef();

    const actionsList = (
        <ActionSheet
            toggleRef={baseTargetRef}
            iosCloseItem={<ActionSheetDefaultIosCloseItem />}
            onClose={() => setPopout(null)}
        >
            <ActionSheetItem
                autoClose
                before={
                    platform === Platform.IOS ? (
                        <Icon28DeleteOutline />
                    ) : (
                        <Icon28DeleteOutlineAndroid />
                    )
                }
                mode='destructive'
                onClick={() => {
                    setPopout(popoutDeleteTask);
                }}
            >
                Удалить сбор
            </ActionSheetItem>
        </ActionSheet>
    );

    const popoutDeleteTask = (
        <Popout
            text='Вы уверены, что хотите удалить сбор?'
            header='Удаление задания'
            action={async () => {
                await updateTask({ taskId: id, payload: payloadCloseTask });
                await deleteTask({ taskId: id });
            }}
            actionText='Удалить сбор'
            setPopout={setPopout}
        />
    );

    const clickIconHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopout(actionsList);
    };

    useEffect(() => {
        if (deleteError?.status || updateError?.status) {
            setSnackbarText({
                type: 'error',
                text: deleteError.data.message || updateError.data.message,
            });
        }
    }, [deleteError, updateError]);

    return (
        <SimpleCell
            key={id}
            disabled={deleteLoading || updateLoading}
            indicator={
                status === 'DONE' ? <GrayText>завершен</GrayText> : <GreenText>открыт</GreenText>
            }
            after={
                <IconButton
                    getRootRef={baseTargetRef}
                    aria-label='actionSheet-button'
                    onClick={(e) => clickIconHandler(e)}
                >
                    <Icon24MoreVertical />
                </IconButton>
            }
            subtitle={`Прислали ${consolidatedData.executedUsersCount}`}
            onClick={() => {
                router.pushPage(PAGE_COLLECTION_ID, { collectionId: id });
            }}
        >
            {name}
        </SimpleCell>
    );
};

const GreenText = styled(Text)`
    color: var(--vkui--color_text_positive);
`;

const GrayText = styled(Text)`
    color: var(--vkui--color_text_secondary);
`;
