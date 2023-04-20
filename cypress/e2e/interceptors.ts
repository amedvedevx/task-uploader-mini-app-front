import type { GetTasksResponce, GetTaskIdResponce } from '../../src/app/types';

const ApiBaseUrl = Cypress.env('API_BASE_URL') as string;

export const interceptTaskId = (taskId: string): GetTaskIdResponce =>
    cy.intercept('GET', `${ApiBaseUrl}/task/${taskId}`).as('getTaskId');

export const interceptTasks = (): GetTasksResponce =>
    cy.intercept('GET', `${ApiBaseUrl}/task`).as('getTasks');

// export const interceptDiary = (bodyData: DiaryResponse): DiaryResponse =>
//     cy.intercept('GET', `${ApiBaseUrl}/diary*`, { body: bodyData }).as('getDiary');

// export const interceptAuth = () => cy.intercept('GET', `${ApiBaseUrl}/auth*`).as('auth');
