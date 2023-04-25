const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL') as string}`;

export const requestDeleteTaskId = (): Cypress.Chainable<Cypress.Response<void>> =>
    cy.request('DELETE', `${ApiBaseUrl}/task/123`);
