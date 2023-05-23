import Common from './Common';

class Home extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get Panel() {
        return cy.getByAutomationId('home-page-panel') as Cypress.Chainable;
    }

    get Placeholder() {
        return cy.getByAutomationId('home-page-placeholder') as Cypress.Chainable;
    }

    get History() {
        return cy.getByAutomationId('home-page-history') as Cypress.Chainable;
    }

    get HistoryList() {
        return cy.getByAutomationId('home-page-historyList') as Cypress.Chainable;
    }

    get DeleteTaskButton() {
        return cy.getByAutomationId('home-page-deleteTaskButton') as Cypress.Chainable;
    }

    get DeleteTaskAction() {
        return cy.getByAutomationId('home-page-deleteTaskAction') as Cypress.Chainable;
    }

    get TaskActionSheet() {
        return cy.getByAutomationId('home-page-taskActionSheet') as Cypress.Chainable;
    }
}

export default Home;
