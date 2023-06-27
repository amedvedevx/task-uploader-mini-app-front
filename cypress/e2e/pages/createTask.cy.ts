import Home from '../../pages/Home';
import Create from '../../pages/Create';
import Common from '../../pages/Common';

describe('User can create task', () => {
    const home = new Home(Cypress.env('API_BASE_URL'));
    const create = new Create(Cypress.env('API_BASE_URL'));
    const common = new Common(Cypress.env('API_BASE_URL'));

    beforeEach(() => {
        cy.visit('/#/collection');
    });

    it('After creating a collection, the user sees that the created collection is displayed on the home page', () => {
        create.TitleInput.type('POST task test');
        common.FooterButtons.children().first().should('not.have.attr', 'disabled');
        common.FooterButtons.click();

        cy.wait(500);
        common.goBackButton.click();

        home.HistoryList.children().first().contains('POST task test');
    });
});
