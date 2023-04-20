export const interceptGeneral = () => {
    cy.intercept('GET', '/schedule*', { fixture: 'schedule.json' }).as('getSession');
    cy.intercept('GET', '/grades*', { fixture: 'grades.json' });
    cy.intercept('GET', '/finalGrades*', { fixture: 'finalGrades.json' });
    cy.intercept('GET', '/tasks*', { fixture: 'tasks.json' });
    cy.intercept('GET', '/diary*', { fixture: 'diary.json' });
};
