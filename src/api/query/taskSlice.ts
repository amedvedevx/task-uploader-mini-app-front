import type {
    AppointTaskProps,
    CreateSubTaskProps,
    CreateTaskProps,
    DeleteSubTaskProps,
    DeleteTaskProps,
    GetTaskIdProps,
    GetTaskIdResponce,
    GetTasksProps,
    GetTasksResponce,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['Task'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<GetTasksResponce, GetTasksProps>({
            query: ({ name, statuses, sort }) => ({
                url: `/task`,
                params: { name, statuses, sort },
            }),
            providesTags: () => [{ type: 'Task' }],
        }),
        getTaskId: builder.query<GetTaskIdResponce, GetTaskIdProps>({
            query: ({ taskId }) => ({
                url: `/task/${taskId}`,
            }),
            providesTags: (result, error, arg) => [{ type: 'Task', id: arg.taskId }],
        }),
        apointTask: builder.mutation<void, AppointTaskProps>({
            query: ({ payload }) => ({
                url: `/task/assign`,
                method: 'PUT',
                body: { payload },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.payload.taskId }],
        }),
        createTask: builder.mutation<void, CreateTaskProps>({
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
                body: { payload },
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
    }),
});

export const {
    useApointTaskMutation,
    useCreateSubTaskMutation,
    useCreateTaskMutation,
    useDeleteSubTaskMutation,
    useDeleteTaskMutation,
    useGetTaskIdQuery,
    useGetTasksQuery,
} = taskResultSlice;
