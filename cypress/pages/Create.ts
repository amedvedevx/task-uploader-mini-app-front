import Common from './Common';

class Create extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get Panel() {
        return cy.getByAutomationId('create-page-panel') as Cypress.Chainable;
    }

    get Placeholder() {
        return cy.getByAutomationId('create-page-placeholder') as Cypress.Chainable;
    }

    get Form() {
        return cy.getByAutomationId('create-page-form') as Cypress.Chainable;
    }

    get TitleInput() {
        return cy.getByAutomationId('create-page-titleInput') as Cypress.Chainable;
    }

    get FooterButton() {
        return cy.getByAutomationId('create-page-footerButton') as Cypress.Chainable;
    }

    get BackButton() {
        return cy.getByAutomationId('create-page-backButton') as Cypress.Chainable;
    }
}

export default Create;
