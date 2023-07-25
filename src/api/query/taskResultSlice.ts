import type {
    DeleteTaskResultProps,
    GetTaskResultsProps,
    GetTaskResultsResponse,
    TaskResults,
} from '@/app/types';

import { apiSlice } from './apiSlice';

const taskResultSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ['TaskResult', 'AllowedRemindIds', 'Task'] })
    .injectEndpoints({
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
            deleteTaskResults: builder.mutation<void, DeleteTaskResultProps>({
                query: ({ taskId, vkUserIds }) => ({
                    url: `/task-result/${taskId}`,
                    method: 'DELETE',
                    body: { vkUserIds },
                }),
                invalidatesTags: ['TaskResult', 'AllowedRemindIds', 'Task'],
            }),
        }),
    });

export const { useGetTaskResultsQuery, useDeleteTaskResultsMutation } = taskResultSlice;
