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

    get HeaderContent() {
        return cy.getByAutomationId('upload-page-headerContent') as Cypress.Chainable;
    }

    get TaskDescription() {
        return cy.getByAutomationId('upload-page-taskDescription') as Cypress.Chainable;
    }

    get FilesList() {
        return cy.getByAutomationId('upload-page-filesList') as Cypress.Chainable;
    }

    get CellFile() {
        return cy.getByAutomationId('upload-page-cellFile') as Cypress.Chainable;
    }

    get PlaceholderCompleted() {
        return cy.getByAutomationId('upload-page-placeholderCompleted') as Cypress.Chainable;
    }

    get CancelButton() {
        return cy.getByAutomationId('upload-page-cancelButton') as Cypress.Chainable;
    }

    get SendButton() {
        return cy.getByAutomationId('upload-page-sendFilesButton') as Cypress.Chainable;
    }

    get SnackBarMessage() {
        return cy.getByAutomationId('upload-page-snackBarMessage') as Cypress.Chainable;
    }
}

export default Upload;
