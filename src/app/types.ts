export interface GetTaskResultsResponce {
    taskResults: TaskResults[];
}

export type TaskDetailResultContent = {
    docId: number;
    size: number;
    title: string;
    uploadDate: string;
    url: string;
};

export type TaskDetailResult = {
    resultId: string;
    subTaskId: string;
    taskDetailId: string;
    completeDate: number;
    status: 'LOADED';
    content: TaskDetailResultContent[];
};

export type TaskResults = {
    id: number;
    taskId: string;
    completeDate: number;
    assignDate: string;
    taskResultStatus: TaskStatusTypesForTestee;
    subTaskResults: TaskDetailResult[];
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
        vkUserId: number;
        firstName: string;
        lastName: string;
        fullName: string;
        photo: string;
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
    files: File[];
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

export interface DownloadSingleFileProps {
    title: string;
    taskId: string;
    subTaskId: string;
    docId: number;
    vkUserId: number;
}

export interface PreUploadFilesResponce {
    data: {
        file: string;
        error: string;
        error_desc: string;
    };
    error: unknown;
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
    subTasks: CreateSubTaskPayload[];
}

export interface CreateSubTaskPayload {
    name: string;
    description: string;
    sortOrder: number;
    subTaskType: string;
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
    friends: TesteeType[];
}

export interface GetTesteesResponse {
    count: number;
    items: ChatType[];
    profiles: TesteeType[];
}

export interface GetTesteesProps {
    search: string;
    count: number;
    invitedMemberIds?: number[];
}

export interface GetAllowedForRemindIdsResponce {
    allowedUserIds: number[];
}

export interface GetAllowedForRemindIdsProps {
    taskId: string;
    userIds?: number[];
}

export interface UpdateAllowedForRemindIdsProps {
    taskId: string;
    userIds: number[];
}

export interface GetChatTesteesProps {
    selectedChats: ChatType[];
    invitedMemberIds?: number[];
}

export type ChatType = {
    peer: {
        id: number;
        type: string;
        local_id: number;
    };

    chat_settings: {
        title: string;
        members_count: number;
        owner_id: number;
        active_ids: number[];
        photo: {
            photo_100: string;
        };
    };
};

export interface SendNotificationProps {
    whoToSend: number[];
    ownerName: string;
    taskName: string;
    taskId: string;
}

export type TesteeType = {
    id: number;
    groupName: string;
    full_name: string;
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

export type SnackBarText = {
    type: 'error' | 'success';
    text: string;
} | null;
