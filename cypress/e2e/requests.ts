const ApiBaseUrl = `https://${Cypress.env('API_BASE_URL')}`;

export const requestDeleteTaskId = (): void =>
    cy.request('DELETE', `${ApiBaseUrl}/task/123`);
