import type { GetTasksResponse } from '@/app/types';

export const tasksDateSorting = (data: GetTasksResponse): GetTasksResponse => {
    data.tasks = data.tasks.sort((a, b) => b.dateCreate - a.dateCreate);

    return data;
};
