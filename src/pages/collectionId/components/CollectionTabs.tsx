import { Div, SegmentedControl } from '@vkontakte/vkui';
import type { FC } from 'react';

import type { TaskUserConsolidatedData } from '@/app/types';

import type { TabType } from '../CollectionIdPage';

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
    const usersCompletedTask = taskUsersConsolidated?.executedUsersCount || 0;

    const usersNotCompletedTask =
        taskUsersConsolidated?.notExecutedUsersCount +
            taskUsersConsolidated?.partiallyExecutedUsersCount || 0;

    return (
        <Div>
            <SegmentedControl
                name='selectedTab'
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
