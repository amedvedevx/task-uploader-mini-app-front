import type {
    AppointTaskProps,
    CreateTaskProps,
    DeleteSubTaskProps,
    DeleteTaskProps,
    GetTaskIdProps,
    GetTaskIdResponse,
    GetTasksProps,
    GetTasksResponse,
    UpdateTaskProps,
} from '@/app/types';

import { apiSlice } from './apiSlice';
import { tasksDateSorting } from './mappers';

const taskSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ['Task', 'TaskResult', 'AllowedRemindIds'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getTasks: builder.query<GetTasksResponse, GetTasksProps>({
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
            getTaskId: builder.query<GetTaskIdResponse, GetTaskIdProps>({
                query: ({ taskId }) => ({
                    url: `/task/${taskId}`,
                }),
                providesTags: ['Task'],
            }),
            appointUsersToTask: builder.mutation<void, AppointTaskProps>({
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
            deleteTask: builder.mutation<void, DeleteTaskProps>({
                queryFn: async ({ taskId }, _queryApi, _extraOptions, fetchWithBQ) => {
                    const payloadCloseTask = {
                        fields: [{ fieldName: 'status', value: 'DONE' }],
                    };
                    const closeTaskResponse = await fetchWithBQ({
                        url: `/task/${taskId}`,
                        method: 'PATCH',
                        body: { ...payloadCloseTask },
                    });

                    if (closeTaskResponse.error) {
                        return { error: 'error' };
                    }

                    const deleteResponse = await fetchWithBQ({
                        url: `/task/${taskId}`,
                        method: 'DELETE',
                    });

                    if (deleteResponse.error) {
                        return { error: 'error' };
                    }

                    return { data: 'success' };
                },
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
        }),
    });

export const {
    useAppointUsersToTaskMutation,
    useCreateTaskMutation,
    useDeleteSubTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useGetTaskIdQuery,
    useGetTasksQuery,
} = taskSlice;
