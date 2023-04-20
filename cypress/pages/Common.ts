class Common {
    get pageHeader() {
        return cy.get('.vkuiPanelHeader__in.PanelHeader__in');
    }

    get goBackButton() {
        return cy.get('.vkuiPanelHeaderBack');
    }

    get tabbar() {
        return cy.getByAutomationId('tabbar') as Cypress.Chainable;
    }

    get datePicker() {
        return cy.getByAutomationId('common-date-picker') as Cypress.Chainable;
    }

    get infinitySwiper() {
        return cy.getByAutomationId('common-infinity-swiper') as Cypress.Chainable;
    }

    get currentWeek() {
        return cy.getByAutomationId(`common-week-1`) as Cypress.Chainable;
    }

    get modalCalendar() {
        return cy.getByAutomationId('common-calendar') as Cypress.Chainable;
    }

    get modalCalendarRange() {
        return cy.getByAutomationId('common-calendar-range') as Cypress.Chainable;
    }

    get stickyInfoBlock() {
        return cy.getByAutomationId('common-sticky-info-block') as Cypress.Chainable;
    }

    get detailedContentBlock() {
        return cy.getByAutomationId('common-detailed-content-block') as Cypress.Chainable;
    }

    get materialsList() {
        return cy.getByAutomationId('common-materials-list') as Cypress.Chainable;
    }
}

export default Common;
