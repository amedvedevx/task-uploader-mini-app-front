import { Div, SegmentedControl } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { TaskType } from '@/app/types';
import type { TabType } from '@/pages';
import { useGetTaskIdQuery } from '@/api';

interface CollectionTabsProps {
    collectionId: string;
    selectedTab: TabType;
    setSelectedTab: (arg: TabType) => void;
}

export const CollectionTabs: FC<CollectionTabsProps> = ({
    collectionId,
    selectedTab,
    setSelectedTab,
}) => {
    const { data: currentTask = {} as TaskType } = useGetTaskIdQuery({
        taskId: collectionId,
    });

    const { consolidatedData } = currentTask;

    const usersCompletedTask = consolidatedData?.executedUsersCount || 0;

    const usersNotCompletedTask =
        consolidatedData?.notExecutedUsersCount + consolidatedData?.partiallyExecutedUsersCount ||
        0;

    return (
        <Div>
            <SegmentedControl
                name='selectedTab'
                data-automation-id='collectionId-page-tabs'
                value={selectedTab}
                options={[
                    {
                        label: `Не прислали ${usersNotCompletedTask}`,
                        value: 'notCompleted',
                    },
                    {
                        label: `Прислали ${usersCompletedTask}`,
                        value: 'completed',
                    },
                ]}
                onChange={(value) => setSelectedTab(value as TabType)}
            />
        </Div>
    );
};
