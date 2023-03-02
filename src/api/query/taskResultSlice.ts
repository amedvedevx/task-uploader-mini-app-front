import type {
    DeleteTaskResultProps,
    GetSubTaskResultStatusProps,
    GetSubTaskResultStatusResponce,
    GetTaskResultsProps,
    GetTaskResultsResponce,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['TaskResult'] }).injectEndpoints({
    endpoints: (builder) => ({
        getTaskResults: builder.query<GetTaskResultsResponce, GetTaskResultsProps>({
            query: ({ taskId }) => ({
                url: `/task-result/${taskId}`,
            }),
            providesTags: (result, error, arg) => [{ type: 'TaskResult', id: arg.taskId }],
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
        }),
    }),
});

export const {
    useGetTaskResultsQuery,
    useDeleteTaskResultMutation,
    useLazyGetSubTaskResultStatusQuery,
} = taskResultSlice;
