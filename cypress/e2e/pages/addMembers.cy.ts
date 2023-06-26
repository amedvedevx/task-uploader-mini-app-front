import type { GetTesteesResponse } from '../../../src/app/types';
import AddMembers from '../../pages/AddMembersPage';
import { interceptTestees } from '../interceptors';

describe('User can visit addMembers page', () => {
    const addMembers = new AddMembers(Cypress.env('API_BASE_URL'));

    let testeesData: GetTesteesResponse['profiles'];

    before(() => {
        cy.fixture('testees.json').then((fixtureData: GetTesteesResponse['profiles']) => {
            testeesData = fixtureData;
        });
    });

    beforeEach(() => {
        interceptTestees(testeesData);
        cy.visit('/#/collection/add-members/81a3d768-83db-49af-88c3-b7f30087ea40');
    });

    it('and see addMembers panel', () => {
        addMembers.Panel.should('exist');
    });

    it('and see correct data in list', () => {
        addMembers.MembersList.children().should('have.length', testeesData);
    });
});
