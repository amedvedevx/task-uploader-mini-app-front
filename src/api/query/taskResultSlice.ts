import type {
    DeleteTaskResultProps,
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
            query: ({ taskId }) => ({
                url: `/task-result/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TaskResult'],
        }),
    }),
});

export const { useGetTaskResultsQuery, useDeleteTaskResultMutation } = taskResultSlice;
