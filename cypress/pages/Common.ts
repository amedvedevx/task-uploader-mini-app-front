class Common {
    get pageHeader() {
        return cy.get('.vkuiPanelHeader__in.PanelHeader__in');
    }

    get goBackButton() {
        return cy.get('.vkuiPanelHeaderButton');
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
}

export default Common;
