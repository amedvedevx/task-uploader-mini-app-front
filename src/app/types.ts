export interface GetTaskResultsResponce {
    taskResults: TaskResults[];
}

export type TaskResults = {
    id: number;
    taskId: string;
    completeDate: number;
    assignDate: string;
    taskResultStatus: TaskStatusTypesForTestee;
    taskDetailResults: [
        {
            resultId: string;
            taskDetailId: string;
            completeDate: number;
            status: 'LOADED';
            content: Array<Record<string, unknown>>;
        },
    ];
    testee: {
        vkUserId: number;
        firstName: string;
        lastName: string;
        fullName: string;
        createDate: number;
        photo: string;
    };
};

export interface GetTasksResponce {
    tasks: TaskType[];
}

export interface GetTaskIdResponce extends TaskType {}

export type TaskType = {
    id: string;
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        createDate: string;
    };
    status: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    name: string;
    description: string;
    dateCreate: number;
    deadLine: number;
    subTasks: [
        {
            id: string;
            name: string;
            description: string;
            sortOrder: number;
            subTaskType: FileTypes;
            dateCreate: number;
        },
    ];
    unlimited: boolean;
    consolidatedData: TaskUserConsolidatedData;
};

export type TaskUserConsolidatedData = {
    total: number;
    executedUsersCount: number;
    partiallyExecutedUsersCount: number;
    notExecutedUsersCount: number;
};

export interface GetTaskResultsProps {
    taskId: string;
}

export interface DeleteTaskResultProps {
    taskId: string;
    subTaskId: string;
}

export interface UploadFilesProps {
    taskId: string;
    subTaskId: string;
    files: FormData;
}

export interface UploadFilesResponce {
    taskId: string;
    subTaskId: string;
    status: AddResultStatusTypes;
}

export interface DownloadFilesProps {
    taskId: string;
    subTaskId?: string;
    vkUserId?: number;
}

export interface DownloadFilesResponce {
    files: Record<string, unknown>;
}

export interface GetSubTaskResultStatusProps {
    taskId: string;
    subTaskId: string;
}

export interface GetSubTaskResultStatusResponce {
    taskResultId: string;
    subtaskId: string;
    status: AddResultStatusTypes;
    exception: string;
}

export interface GetTaskIdProps {
    taskId: string;
}

export interface GetTasksProps {
    name?: string;
    statuses?: TaskStatusTypesForOrganizer & TaskStatusTypesForTestee;
    sort?: string;
}

export interface AppointTaskProps {
    payload: {
        taskId: string;
        vkUserIds: number[];
    };
}

export interface CreateTaskProps {
    name: string;
    description: string;
    unlimited: boolean;
    deadLine: number;
}

export interface CreateSubTaskProps {
    taskId: string;
    payload: {
        rows: Array<{
            name: string;
            description: string;
            subTaskType: string;
        }>;
    };
}

export interface UpdateTaskProps {
    taskId: string;
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
        deadLine: number;
    };
}

export interface DeleteTaskProps {
    taskId: string;
}
export interface DeleteSubTaskProps {
    taskId: string;
    subTaskId: string;
}

export interface GetMembersResponce {
    friends: FriendsType[];
}

export interface GetTesteesProps {
    search: string;
    count: number;
}

export type FriendsType = {
    id: number;
    can_access_closed: boolean;
    first_name: string;
    is_closed: boolean;
    last_name: string;
    photo_100: string;
    track_code: string;
};

export enum TaskStatusTypesForOrganizer {
    'NEW' = 'NEW',
    'IN_PROGRESS' = 'IN_PROGRESS',
    'DONE' = 'DONE',
}

export enum TaskStatusTypesForTestee {
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
