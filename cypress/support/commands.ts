import '@testing-library/cypress/add-commands';

Cypress.Commands.add(
    'getByAutomationId',
    { prevSubject: 'optional' },
    (subject: Cypress.Chainable<Element>, id: string): Cypress.Chainable<JQuery<HTMLElement>> => {
        const selector = `[data-automation-id="${id}"]`;

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        if (subject) {
            return subject.find(selector);
        }

        return cy.get(selector);
    },
);

Cypress.Commands.add(
    'getByAutomationIdPrefix',
    { prevSubject: 'optional' },
    (subject: Cypress.Chainable<Element>, idPrefix: string) => {
        const selector = `[data-automation-id^="${idPrefix}"]`;

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        if (subject) {
            return subject.find(selector);
        }

        return cy.get(selector);
    },
);
