import { Tabs, TabsItem } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { TaskUserConsolidatedData } from '@/app/types';
import type { TabType } from '@/pages';

interface CollectionTabsProps {
    selectedTab: TabType;
    setSelectedTab: (arg: TabType) => void;
    taskUsersConsolidated: TaskUserConsolidatedData;
}

export const CollectionTabs: FC<CollectionTabsProps> = ({
    selectedTab,
    setSelectedTab,
    taskUsersConsolidated,
}) => {
    const usersCompletedTask =
        taskUsersConsolidated?.executedUsersCount +
        taskUsersConsolidated?.partiallyExecutedUsersCount;

    const usersNotCompletedTask = taskUsersConsolidated?.total - usersCompletedTask;

    return (
        <Tabs>
            <TabsItem
                selected={selectedTab === 'notCompleted'}
                id='notCompletedTasks'
                aria-controls='tab-content-notCompletedTasks'
                onClick={() => setSelectedTab('notCompleted')}
            >
                {`Не прислали ${usersNotCompletedTask}`}
            </TabsItem>

            <TabsItem
                id='completedTasks'
                selected={selectedTab === 'completed'}
                aria-controls='tab-content-completedTasks'
                onClick={() => setSelectedTab('completed')}
            >
                {`Прислали ${usersCompletedTask}`}
            </TabsItem>
        </Tabs>
    );
};
