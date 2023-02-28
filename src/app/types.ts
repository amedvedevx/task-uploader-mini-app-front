export interface GetTaskResultsResponce {
    taskResults: [
        {
            id: number;
            taskId: number;
            completeDate: string;
            assignDate: string;
            taskResultStatus: TaskStatusTypesForTestee;
            taskDetailResults: [
                {
                    resultId: number;
                    taskDetailId: number;
                    completeDate: string;
                    status: 'LOADED';
                    content: Array<Record<string, unknown>>;
                },
            ];
            testee: {
                id: number;
                firstName: string;
                lastName: string;
                createDate: string;
            };
        },
    ];
}

export interface GetTasksResponce {
    tasks: TaskType[];
}

export interface GetTaskIdResponce extends TaskType {}

export type TaskType = {
    id: number;
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        createDate: string;
    };
    status: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    name: string;
    description: string;
    dateCreate: string;
    deadLine: string;
    subTasks: [
        {
            id: number;
            name: string;
            description: string;
            sortOrder: number;
            subTaskType: FileTypes;
            dateCreate: string;
        },
    ];
    unlimited: boolean;
};

export interface GetTaskResultsProps {
    taskResultId: number;
}

export interface DeleteTaskResultProps {
    taskResultId: number;
    subTaskId: number;
}

export interface CompleteSubTaskProps {
    taskResultId: number;
    subTaskId: number;
    files: Record<string, unknown>;
}

export interface GetTaskIdProps {
    taskId: number;
}

export interface GetTasksProps {
    name?: string;
    statuses?: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    sort?: string;
}

export interface AppointTaskProps {
    payload: {
        taskId: number;
        userIds: number[];
    };
}

export interface CreateTaskProps {
    payload: {
        name: string;
        description: string;
        unlimited: boolean;
        deadLine: string;
    };
}

export interface CreateSubTaskProps {
    taskId: number;
    payload: {
        rows: Array<{
            name: string;
            description: string;
            sortOrder: number;
            subTaskType: string;
        }>;
    };
}

export interface DeleteTaskProps {
    taskId: number;
}
export interface DeleteSubTaskProps {
    taskId: number;
    subTaskId: number;
}

enum TaskStatusTypesForOrganizer {
    'NEW' = 'NEW',
    'IN_PROGRESS'= 'IN_PROGRESS',
    'DONE'= 'DONE',
}

enum TaskStatusTypesForTestee {
    'UPLOAD_IN_PROGRESS' = 'UPLOAD_IN_PROGRESS',
    'REQUIRES_UPLOAD'= 'REQUIRES_UPLOAD',
    'UPLOADED'= 'UPLOADED',
    'UNDER_REVIEW'= 'UNDER_REVIEW',
    'COMPLETED'= 'COMPLETED',
    'OVERDUE_COMPLETED'= 'OVERDUE_COMPLETED',
    'NOT_COMPLETED'= 'NOT_COMPLETED',
}

enum FileTypes {
    'FILE' = 'FILE',
}

export enum UserTypes {
    'ORGANIZER' = 'ORGANIZER',
    'TESTEE' = 'TESTEE',
}
