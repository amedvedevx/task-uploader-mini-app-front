import type { GetTasksResponce } from '@/app/types';

export const tasksDateSorting = (data: GetTasksResponce): GetTasksResponce => {
    data.tasks = data.tasks.sort((a, b) => b.dateCreate - a.dateCreate);

    return data;
};
