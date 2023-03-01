import type {
    DeleteTaskResultProps,
    GetTaskResultsProps,
    GetTaskResultsResponce,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['TaskResult'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTaskResults: builder.query<GetTaskResultsResponce, GetTaskResultsProps>({
            query: ({ taskResultId }) => ({
                url: `/task-result/${taskResultId}`,
            }),
            providesTags: (result, error, arg) => [{ type: 'TaskResult', id: arg.taskResultId }],
        }),
        deleteTaskResult: builder.mutation<void, DeleteTaskResultProps>({
            query: ({ taskResultId, subTaskId }) => ({
                url: `/task-result/${taskResultId}/${subTaskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'TaskResult', id: arg.taskResultId }],
        }),
    }),
});

export const { useGetTaskResultsQuery, useDeleteTaskResultMutation } = taskResultSlice;
