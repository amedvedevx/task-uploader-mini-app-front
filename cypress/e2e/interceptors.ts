import type {
    GetTasksResponce,
    GetTaskIdResponce,
    GetTaskResultsResponce,
    GetSubTaskResultStatusResponce,
    GetTesteesResponse,
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

export const interceptTaskResultStatus = (
    bodyData: GetSubTaskResultStatusResponce,
): Cypress.Chainable<null> =>
    cy
        .intercept(
            'GET',
            `${ApiBaseUrl}/task-result/08ef58ee-18e4-452d-ac23-f9482c5d2bef/88b766e7-1ae1-4ed1-9985-2cbbba050f59`,
            {
                body: bodyData,
            },
        )
        .as('getTaskResultStatus');

export const interceptTestees = (
    bodyData: GetTesteesResponse['profiles'],
): Cypress.Chainable<null> =>
    cy
        .intercept(
            'GET',
            `${ApiBaseUrl}/collection/add-members/81a3d768-83db-49af-88c3-b7f30087ea40`,
            {
                body: bodyData,
            },
        )
        .as('getTestees');
