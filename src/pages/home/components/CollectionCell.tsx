import {
    ActionSheet,
    ActionSheetDefaultIosCloseItem,
    ActionSheetItem,
    IconButton,
    Platform,
    SimpleCell as SimpleCellRoot,
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
import { useDeleteTaskMutation } from '@/api';
import { Popout } from '@/components/Popout';
import type { ResponseError } from '@/api/query/apiSlice';

interface CollectionCellProps {
    id: string;
    name: string;
    status: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    consolidatedData: TaskUserConsolidatedData;
    setPopout: (arg: JSX.Element | null) => void;
    setSnackbarText: React.Dispatch<React.SetStateAction<SnackBarText>>;
}

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

    const baseTargetRef = useRef(null);

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
                        <Icon28DeleteOutline color='var(--vkui--color_text_negative)' />
                    ) : (
                        <Icon28DeleteOutlineAndroid color='var(--vkui--color_text_negative)' />
                    )
                }
                mode='destructive'
                data-automation-id='home-page-deleteTaskAction'
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
            destructiveAction
            text='Вы уверены, что хотите удалить сбор?'
            header='Удаление задания'
            action={() => deleteTask({ taskId: id })}
            actionText='Удалить сбор'
            setPopout={setPopout}
            data-automation-id='home-page-deleteTaskButton'
        />
    );

    const clickIconHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        setPopout(actionsList);
    };

    useEffect(() => {
        if (deleteError && 'status' in deleteError) {
            setSnackbarText({
                type: 'error',
                text: deleteError.data.message,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteError]);

    return (
        <SimpleCell
            key={id}
            disabled={deleteLoading}
            indicator={
                status === 'DONE' ? <GrayText>завершен</GrayText> : <GreenText>открыт</GreenText>
            }
            after={
                <IconButton
                    getRootRef={baseTargetRef}
                    aria-label='actionSheet-button'
                    data-automation-id='home-page-taskActionSheet'
                    onClick={(e) => clickIconHandler(e)}
                >
                    <Icon24MoreVertical color='var(--vkui--color_icon_secondary)' />
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

const SimpleCell = styled(SimpleCellRoot)`
    .vkuiSimpleCell__main {
        width: 100px;
    }
`;

const GreenText = styled(Text)`
    color: var(--vkui--color_text_positive);
`;

const GrayText = styled(Text)`
    color: var(--vkui--color_text_secondary);
`;
