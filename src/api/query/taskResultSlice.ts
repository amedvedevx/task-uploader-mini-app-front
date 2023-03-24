import type {
    DeleteTaskResultProps,
    GetSubTaskResultStatusProps,
    GetSubTaskResultStatusResponce,
    GetTaskResultsProps,
    GetTaskResultsResponce,
    TaskResults,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['TaskResult'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTaskResults: builder.query<GetTaskResultsResponce, GetTaskResultsProps>({
            query: ({ taskId }) => ({
                url: `/task-result/${taskId}`,
            }),
            providesTags: (result, error, arg) => [{ type: 'TaskResult', id: arg.taskId }],
            transformResponse: (response: { taskResults: TaskResults[] }) => ({
                taskResults: response.taskResults,
            }),
        }),
        deleteTaskResult: builder.mutation<void, DeleteTaskResultProps>({
            query: ({ taskId, subTaskId }) => ({
                url: `/task-result/${taskId}/${subTaskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'TaskResult', id: arg.taskId }],
        }),
        getSubTaskResultStatus: builder.query<
            GetSubTaskResultStatusResponce,
            GetSubTaskResultStatusProps
        >({
            query: ({ taskId, subTaskId }) => ({
                url: `/task-result/${taskId}/${subTaskId}`,
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetTaskResultsQuery,
    useDeleteTaskResultMutation,
    useGetSubTaskResultStatusQuery,
} = taskResultSlice;
