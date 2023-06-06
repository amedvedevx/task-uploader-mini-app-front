import type {
    DeleteTaskResultProps,
    GetSubTaskResultStatusProps,
    GetSubTaskResultStatusResponse,
    GetTaskResultsProps,
    GetTaskResultsResponse,
    TaskResults,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['TaskResult'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTaskResults: builder.query<GetTaskResultsResponse, GetTaskResultsProps>({
            query: ({ taskId }) => ({
                url: `/task-result/${taskId}`,
            }),
            providesTags: ['TaskResult'],
            transformResponse: (response: { taskResults: TaskResults[] }) => ({
                taskResults: response.taskResults,
            }),
        }),
        deleteTaskResult: builder.mutation<void, DeleteTaskResultProps>({
            query: ({ taskId, subTaskId }) => ({
                url: `/task-result/${taskId}/${subTaskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TaskResult'],
        }),
        getSubTaskResultStatus: builder.query<
            GetSubTaskResultStatusResponse,
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
