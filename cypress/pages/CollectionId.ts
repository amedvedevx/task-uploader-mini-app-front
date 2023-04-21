import Common from './Common';

class CollectionId extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get Panel() {
        return cy.getByAutomationId('collectionId-page-panel') as Cypress.Chainable;
    }
}

export default CollectionId;
