import CollectionId from '../../pages/CollectionId';
import Create from '../../pages/Create';
import Home from '../../pages/Home';

describe('User can create task', () => {
    const create = new Create(Cypress.env('API_BASE_URL'));
    const home = new Home(Cypress.env('API_BASE_URL'));
    const collectionId = new CollectionId(Cypress.env('API_BASE_URL'));

    beforeEach(() => {
        cy.visit('/#/collection');
    });

    it('POST /task', () => {
        create.TitleInput.type('POST task test');
        create.FooterButtons.children().first().should('not.have.attr', 'disabled');
        create.FooterButtons.click();

        collectionId.BackButton.click();

        home.HistoryList.children().first().contains('POST task test');
    });
});
