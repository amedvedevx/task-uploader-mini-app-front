import CollectionId from '../../pages/CollectionId';
import Create from '../../pages/Create';
import Home from '../../pages/Home';

describe('User can visit create page', () => {
    const create = new Create(Cypress.env('API_BASE_URL'));
    const home = new Home(Cypress.env('API_BASE_URL'));
    const collectionId = new CollectionId(Cypress.env('API_BASE_URL'));

    beforeEach(() => {
        cy.visit('/#/collection');
    });

    it('and see createPage panel', () => {
        create.Panel.should('exist');
    });

    it('and see createPage placeholder', () => {
        create.Placeholder.should('exist');
    });

    it('and see createPage form', () => {
        create.Form.should('exist');
    });

    it('and see createPage footer', () => {
        create.Footer.should('exist');
    });

    it('and see createPage footerButtons', () => {
        create.FooterButtons.should('exist');
    });

    it('and see createPage footerButton should be default disabled', () => {
        create.FooterButtons.children().first().should('have.attr', 'disabled');
    });

    it('POST /task', () => {
        create.TitleInput.type('testTile1');
        create.FooterButtons.children().first().should('not.have.attr', 'disabled');
        create.FooterButtons.click();

        collectionId.BackButton.click();

        home.HistoryList.children().contains('testTile1');
    });

    it('if user click back he will be redirected to home', () => {
        create.BackButton.click();
        home.Panel.should('exist');
    });
});
