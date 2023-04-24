import type {
    GetTasksResponce,
    GetTaskIdResponce,
    GetTaskResultsResponce,
    UploadFilesResponce,
} from '../../src/app/types';

const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL')}`;

export const interceptTaskId = (bodyData: GetTaskIdResponce): GetTaskIdResponce =>
    cy
        .intercept('GET', `${ApiBaseUrl}/task/08ef58ee-18e4-452d-ac23-f9482c5d2bef`, {
            body: bodyData,
        })
        .as('getTaskId');

export const interceptTasks = (bodyData: GetTasksResponce): GetTasksResponce =>
    cy.intercept('GET', `${ApiBaseUrl}/task?`, { body: bodyData }).as('getTasks');

export const interceptDeleteTaskId = (bodyData: GetTasksResponce): void =>
    cy
        .intercept('DELETE', `${ApiBaseUrl}/task/*`, { body: bodyData.tasks.slice(1) })
        .as('deleteTaskId');

export const interceptTaskIdResults = (bodyData: GetTaskResultsResponce): void =>
    cy
        .intercept('GET', `${ApiBaseUrl}/collectionId/08ef58ee-18e4-452d-ac23-f9482c5d2bef`, {
            body: bodyData,
        })
        .as('taskIdResults');

export const interceptUploadFiles = (bodyData: UploadFilesResponce): UploadFilesResponce =>
    cy.intercept('PUT', `${ApiBaseUrl}/files?`, { body: bodyData }).as('uploadFiles');
