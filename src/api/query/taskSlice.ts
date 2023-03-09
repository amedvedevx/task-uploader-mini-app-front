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

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['Task'] }).injectEndpoints({
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
            providesTags: (result) => [{ type: 'Task', id: result?.id }],
        }),
        apointTask: builder.mutation<void, AppointTaskProps>({
            query: ({ payload }) => ({
                url: `/task/assign`,
                method: 'PUT',
                body: { payload },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.payload.taskId }],
        }),
        createTask: builder.mutation<{ taskId: number }, CreateTaskProps>({
            query: ({ payload }) => ({
                url: `/task`,
                method: 'POST',
                body: { payload },
            }),
            invalidatesTags: () => [{ type: 'Task' }],
        }),
        createSubTask: builder.mutation<void, CreateSubTaskProps>({
            query: ({ taskId, payload }) => ({
                url: `/task/sub-task/${taskId}`,
                method: 'POST',
                body: { ...payload },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.taskId }],
        }),
        deleteTask: builder.mutation<void, DeleteTaskProps>({
            query: ({ taskId }) => ({
                url: `/task/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.taskId }],
        }),
        deleteSubTask: builder.mutation<void, DeleteSubTaskProps>({
            query: ({ taskId, subTaskId }) => ({
                url: `/task/${taskId}/${subTaskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.taskId }],
        }),

        updateTask: builder.mutation<void, UpdateTaskProps>({
            query: ({ taskId, payload }) => ({
                url: `/task/${taskId}`,
                method: 'PATCH',
                body: { ...payload },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.id }],
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
            invalidatesTags: () => [{ type: 'Task' }],
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
