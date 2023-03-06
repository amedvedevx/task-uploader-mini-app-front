export interface GetTaskResultsResponce {
    taskResults: TaskResults[];
}

export type TaskResults = {
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
};

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
    consolidatedData: {
        executedUsersCount: number;
        partiallyExecutedUsersCount: number;
    };
};

export interface GetTaskResultsProps {
    taskId: number;
}

export interface DeleteTaskResultProps {
    taskId: number;
    subTaskId: number;
}

export interface UploadFilesProps {
    taskId: number;
    subTaskId: number;
    files: FormData;
}

export interface UploadFilesResponce {
    taskId: number;
    subTaskId: number;
    status: AddResultStatusTypes;
}

export interface GetFilesProps {
    taskId: number;
    subTaskId?: number;
    userId?: number;
}

export interface GetFilesResponce {
    files: Record<string, unknown>;
}

export interface GetSubTaskResultStatusProps {
    taskId: number;
    subTaskId: number;
}

export interface GetSubTaskResultStatusResponce {
    taskResultId: number;
    subtaskId: number;
    status: AddResultStatusTypes;
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
            subTaskType: string;
        }>;
    };
}

export interface UpdateTaskProps {
    id: number;
    taskId: number;
    payload: {
        fields: Array<{
            fieldName: string;
            value: string;
        }>;
    };
}

export interface CreateWideTask {
    payload: {
        name: string;
        description: string;
        unlimited: boolean;
        deadLine: string;
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
    'IN_PROGRESS' = 'IN_PROGRESS',
    'DONE' = 'DONE',
}

enum TaskStatusTypesForTestee {
    'UPLOAD_IN_PROGRESS' = 'UPLOAD_IN_PROGRESS',
    'REQUIRES_UPLOAD' = 'REQUIRES_UPLOAD',
    'UPLOADED' = 'UPLOADED',
    'UNDER_REVIEW' = 'UNDER_REVIEW',
    'COMPLETED' = 'COMPLETED',
    'OVERDUE_COMPLETED' = 'OVERDUE_COMPLETED',
    'NOT_COMPLETED' = 'NOT_COMPLETED',
}

enum FileTypes {
    'FILE' = 'FILE',
}

export enum UserTypes {
    'ORGANIZER' = 'ORGANIZER',
    'TESTEE' = 'TESTEE',
}

export enum AddResultStatusTypes {
    'IN_PROGRESS' = 'IN_PROGRESS',
    'LOADED' = 'LOADED',
    'NOT_LOADED' = 'NOT_LOADED',
}
