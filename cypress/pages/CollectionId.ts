import Common from './Common';

class CollectionId extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get HeaderContent() {
        return cy.getByAutomationId('collectionId-page-headerContent') as Cypress.Chainable;
    }

    get CopyLink() {
        return cy.getByAutomationId('collectionId-page-copyLink') as Cypress.Chainable;
    }

    get Tabs() {
        return cy.getByAutomationId('collectionId-page-tabs') as Cypress.Chainable;
    }

    get AddTesteesButton() {
        return cy.getByAutomationId('collectionId-page-addTestees-button') as Cypress.Chainable;
    }

    get RemindAllButton() {
        return cy.getByAutomationId('collectionId-page-remindAll-button') as Cypress.Chainable;
    }

    get MembersList() {
        return cy.getByAutomationId('collectionId-page-membersList') as Cypress.Chainable;
    }
}

export default CollectionId;
