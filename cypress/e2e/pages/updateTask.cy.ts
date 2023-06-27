import Create from '../../pages/Create';
import Common from '../../pages/Common';

describe('User can create and update task', () => {
    const create = new Create(Cypress.env('API_BASE_URL'));
    const common = new Common(Cypress.env('API_BASE_URL'));

    beforeEach(() => {
        cy.visit('/#/collection');
    });

    it('After updating the task, the user sees in the footer that the collection is completed', () => {
        create.TitleInput.type('PATCH task test');
        common.FooterButtons.children().first().should('not.have.attr', 'disabled');
        common.FooterButtons.click();

        common.pageHeader.should('contain.text', 'Активное задание');
        common.pageHeader.should('contain.text', 'PATCH task test');

        common.Footer.click();
        common.Popout.contains('Завершить задание');
        cy.get('.vkuiAlert__button').contains('Завершить сбор').trigger('mouseover').click();

        common.FooterButtons.children().first().should('not.have.attr', 'disabled');
        common.Footer.contains('Сбор завершен');
    });
});
