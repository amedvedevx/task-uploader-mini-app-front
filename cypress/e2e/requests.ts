const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL') as string}`;

export const requestDeleteTaskId = (): Cypress.Chainable<Cypress.Response<void>> =>
    cy.request('DELETE', `${ApiBaseUrl}/task/123`);

export const requestGetSubTaskResultStatus = (): Cypress.Chainable<Cypress.Response<void>> =>
    cy.request(
        'GET',
        `${ApiBaseUrl}/task-result/08ef58ee-18e4-452d-ac23-f9482c5d2bef/88b766e7-1ae1-4ed1-9985-2cbbba050f59`,
    );
