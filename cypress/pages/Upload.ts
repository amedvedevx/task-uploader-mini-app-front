import Common from './Common';

class Upload extends Common {
    apiBaseUrl: string;

    constructor(baseUrl: string) {
        super();
        this.apiBaseUrl = baseUrl;
    }

    get Panel() {
        return cy.getByAutomationId('upload-page-panel') as Cypress.Chainable;
    }

    get DropZone() {
        return cy.getByAutomationId('upload-page-dropZone') as Cypress.Chainable;
    }

    get Placeholder() {
        return cy.getByAutomationId('upload-page-placeholder') as Cypress.Chainable;
    }

    get Files() {
        return cy.getByAutomationId('upload-page-files') as Cypress.Chainable;
    }

    get FilesList() {
        return cy.getByAutomationId('home-page-filesList') as Cypress.Chainable;
    }

    get CancelFilesButton() {
        return cy.getByAutomationId('upload-page-cancelButton') as Cypress.Chainable;
    }

    get SendFilesButton() {
        return cy.getByAutomationId('upload-page-sendFilesButton') as Cypress.Chainable;
    }
}

export default Upload;
