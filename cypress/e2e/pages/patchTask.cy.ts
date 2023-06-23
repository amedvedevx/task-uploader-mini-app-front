import CollectionId from '../../pages/CollectionId';
import Common from '../../pages/Common';
import Create from '../../pages/Create';

describe('User can create and close task', () => {
    const create = new Create(Cypress.env('API_BASE_URL'));
    const common = new Common(Cypress.env('API_BASE_URL'));
    const collectionId = new CollectionId(Cypress.env('API_BASE_URL'));

    beforeEach(() => {
        cy.visit('/#/collection');
    });

    it('PATCH /task', () => {
        create.TitleInput.type('PATCH task test');
        create.FooterButtons.children().first().should('not.have.attr', 'disabled');
        create.FooterButtons.click();

        collectionId.HeaderContent.should('contain.text', 'Активное задание');
        collectionId.HeaderContent.should('contain.text', 'PATCH task test');

        common.Footer.click();
        common.Popout.contains('Завершить задание');
        cy.get('.vkuiAlert__button').contains('Завершить сбор').trigger('mouseover').click();

        common.FooterButtons.children().first().should('not.have.attr', 'disabled');
        common.Footer.contains('Сбор завершен');
    });
});
