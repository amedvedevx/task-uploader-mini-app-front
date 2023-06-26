class Common {
    get pageHeader() {
        return cy.get('.vkuiPanelHeader__in');
    }

    get goBackButton() {
        return cy.get('.vkuiPanelHeaderBack');
    }

    get Footer() {
        return cy.getByAutomationId('common-footer') as Cypress.Chainable;
    }

    get FooterButtons() {
        return cy.getByAutomationId('common-footerButtons') as Cypress.Chainable;
    }

    get SearchBar() {
        return cy.getByAutomationId('common-searchBar') as Cypress.Chainable;
    }

    get Popout() {
        return cy.getByAutomationId('common-popout') as Cypress.Chainable;
    }

    get PopoutButtons() {
        return cy.getByAutomationId('common-popout-buttons') as Cypress.Chainable;
    }
}

export default Common;
