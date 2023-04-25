import type {
    GetTasksResponce,
    GetTaskIdResponce,
    GetTaskResultsResponce,
} from '../../src/app/types';

const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL') as string}`;

export const interceptTaskId = (
    bodyData: GetTaskIdResponce,
): Cypress.Chainable<GetTaskIdResponce> =>
    cy
        .intercept('GET', `${ApiBaseUrl}/task/08ef58ee-18e4-452d-ac23-f9482c5d2bef`, {
            body: bodyData,
        })
        .as('getTaskId');

export const interceptTasks = (bodyData: GetTasksResponce): Cypress.Chainable<GetTasksResponce> =>
    cy.intercept('GET', `${ApiBaseUrl}/task?`, { body: bodyData }).as('getTasks');

export const interceptDeleteTaskId = (bodyData: GetTasksResponce): Cypress.Chainable<null> =>
    cy
        .intercept('DELETE', `${ApiBaseUrl}/task/*`, { body: bodyData.tasks.slice(1) })
        .as('deleteTaskId');

export const interceptTaskIdResults = (bodyData: GetTaskResultsResponce): Cypress.Chainable<null> =>
    cy
        .intercept('GET', `${ApiBaseUrl}/collectionId/08ef58ee-18e4-452d-ac23-f9482c5d2bef`, {
            body: bodyData,
        })
        .as('taskIdResults');
