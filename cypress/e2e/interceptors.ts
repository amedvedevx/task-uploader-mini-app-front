import type { GetTasksResponce, GetTaskIdResponce, UploadFilesResponce } from '../../src/app/types';

const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL')}`;

export const interceptTaskId = (): GetTaskIdResponce =>
    cy.intercept('GET', `${ApiBaseUrl}/task/*`).as('getTaskId');

export const interceptTasks = (bodyData: GetTasksResponce): GetTasksResponce =>
    cy.intercept('GET', `${ApiBaseUrl}/task?`, { body: bodyData }).as('getTasks');

export const interceptDeleteTaskId = (bodyData: GetTasksResponce): void =>
    cy
        .intercept('DELETE', `${ApiBaseUrl}/task/*`, { body: bodyData.tasks.slice(1) })
        .as('deleteTaskId');

export const interceptUploadFiles = (bodyData: UploadFilesResponce): UploadFilesResponce =>
    cy.intercept('PUT', `${ApiBaseUrl}/files?`, { body: bodyData }).as('uploadFiles');
