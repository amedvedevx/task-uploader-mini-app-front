import type { TaskResults, TaskType } from '../../../src/app/types';

const BASE_URL = Cypress.env('BASE_URL') as string;
const AUTH_TOKEN = Cypress.env('AUTH_TOKEN') as string;

const AUTH_HEADERS = {
    Authorization: AUTH_TOKEN,
};

export class TaskService {
    createTask(task: Partial<TaskType>) {
        return cy.request<TaskType>({
            method: 'POST',
            url: `${BASE_URL}/task`,
            body: task,
            headers: {
                ...AUTH_HEADERS,
            },
        });
    }

    getTaskById(id: string) {
        return cy.request<TaskType>({
            method: 'GET',
            url: `${BASE_URL}/task/${id}`,
            headers: {
                ...AUTH_HEADERS,
            },
        });
    }

    updateTaskById(id: string, body: Partial<TaskType>) {
        const adaptedBody = {
            fields: Object.entries(body).map(([fieldKey, fieldValue]) => ({
                fieldName: fieldKey,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: fieldValue,
            })),
        };

        return cy.request<TaskType>({
            method: 'PATCH',
            url: `${BASE_URL}/task/${id}`,
            headers: {
                ...AUTH_HEADERS,
            },
            body: adaptedBody,
        });
    }

    assignUsersOnTask(taskId: string, userIds: number[]) {
        return cy.request({
            method: 'PUT',
            url: `${BASE_URL}/task/assign`,
            headers: {
                ...AUTH_HEADERS,
            },
            body: {
                taskId,
                vkUserIds: userIds,
            },
        });
    }

    getTaskResultById(taskId: string) {
        return cy.request<{ taskResults: TaskResults[] }>({
            method: 'GET',
            url: `${BASE_URL}/task-result/${taskId}`,
            headers: {
                ...AUTH_HEADERS,
            },
        });
    }
}
