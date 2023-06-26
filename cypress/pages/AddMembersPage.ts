import Common from './Common';

class AddMembers extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get Panel() {
        return cy.getByAutomationId('addMembers-page-panel') as Cypress.Chainable;
    }

    get Tabs() {
        return cy.getByAutomationId('collectionId-page-tabs') as Cypress.Chainable;
    }

    get AddTesteesButton() {
        return cy.getByAutomationId('collectionId-page-addTestees-button') as Cypress.Chainable;
    }

    get MembersList() {
        return cy.getByAutomationId('addMembers-page-membersList') as Cypress.Chainable;
    }
}

export default AddMembers;
