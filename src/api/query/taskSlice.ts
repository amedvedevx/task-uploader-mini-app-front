import type {
    AppointTaskProps,
    CreateSubTaskProps,
    CreateTaskProps,
    CreateWideTask,
    DeleteSubTaskProps,
    DeleteTaskProps,
    GetTaskIdProps,
    GetTaskIdResponce,
    GetTasksProps,
    GetTasksResponce,
    UpdateTaskProps,
} from '@/app/types';

import { apiSlice } from './apiSlice';
import { tasksDateSorting } from './mappers';

const taskResultSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ['Task', 'TaskResult', 'AllowedRemindIds'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getTasks: builder.query<GetTasksResponce, GetTasksProps>({
                query: ({ name, statuses, sort }) => ({
                    url: `/task`,
                    params: { name, statuses, sort },
                }),
                transformResponse: tasksDateSorting,

                providesTags: (result) =>
                    result
                        ? [...result.tasks.map(({ id }) => ({ type: 'Task' as const, id })), 'Task']
                        : ['Task'],
            }),
            getTaskId: builder.query<GetTaskIdResponce, GetTaskIdProps>({
                query: ({ taskId }) => ({
                    url: `/task/${taskId}`,
                }),
                providesTags: ['Task'],
            }),
            apointTask: builder.mutation<void, AppointTaskProps>({
                query: ({ payload }) => ({
                    url: `/task/assign`,
                    method: 'PUT',
                    body: { ...payload },
                }),
                invalidatesTags: ['Task', 'TaskResult', 'AllowedRemindIds'],
            }),
            createTask: builder.mutation<{ taskId: string }, CreateTaskProps>({
                query: (payload) => ({
                    url: `/task`,
                    method: 'POST',
                    body: { ...payload },
                }),
                invalidatesTags: ['Task'],
            }),
            createSubTask: builder.mutation<void, CreateSubTaskProps>({
                query: ({ taskId, payload }) => ({
                    url: `/task/sub-task/${taskId}`,
                    method: 'POST',
                    body: { ...payload },
                }),
                invalidatesTags: ['Task'],
            }),
            deleteTask: builder.mutation<void, DeleteTaskProps>({
                query: ({ taskId }) => ({
                    url: `/task/${taskId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Task'],
            }),
            deleteSubTask: builder.mutation<void, DeleteSubTaskProps>({
                query: ({ taskId, subTaskId }) => ({
                    url: `/task/${taskId}/${subTaskId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Task'],
            }),

            updateTask: builder.mutation<void, UpdateTaskProps>({
                query: ({ taskId, payload }) => ({
                    url: `/task/${taskId}`,
                    method: 'PATCH',
                    body: { ...payload },
                }),
                invalidatesTags: ['Task'],
            }),

            createWideTask: builder.mutation<string, CreateWideTask>({
                queryFn: async ({ payload }, _queryApi, _extraOptions, fetchWithBQ) => {
                    const createTaskResponse = await fetchWithBQ({
                        url: `/task`,
                        method: 'POST',
                        body: { ...payload },
                    });

                    const { taskId } = createTaskResponse.data as { taskId: string };

                    await fetchWithBQ({
                        url: `/task/sub-task/${taskId}`,
                        method: 'POST',
                        body: {
                            rows: [
                                {
                                    name: `Подзадание ${payload.name}`,
                                    description: payload.description,
                                    sortOrder: 1,
                                    subTaskType: 'FILE',
                                },
                            ],
                        },
                    });

                    return { data: taskId };
                },
                invalidatesTags: ['Task', 'AllowedRemindIds', 'TaskResult'],
            }),
        }),
    });

export const {
    useApointTaskMutation,
    useCreateSubTaskMutation,
    useCreateTaskMutation,
    useDeleteSubTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useCreateWideTaskMutation,
    useGetTaskIdQuery,
    useGetTasksQuery,
} = taskResultSlice;
