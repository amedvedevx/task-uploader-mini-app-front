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

    // get homeHeader() {
    //     return this.pageHeader.contains('Дневник');
    // }
}

export default Home;
