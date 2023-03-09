import type { GetTasksResponce } from '@/app/types';

export const tasksDateSorting = (data: GetTasksResponce): GetTasksResponce =>{
    console.log(data)
    data.tasks = data.tasks.sort((a, b) => a.dateCreate - b.dateCreate);
    console.log(data)
    return data
}
