import type { GetTasksResponce } from '../../../src/app/types';
import CollectionId from '../../pages/CollectionId';
import Home from '../../pages/Home';
import { interceptDeleteTaskId, interceptTaskId, interceptTasks } from '../interceptors';

describe('User can visit home page', () => {
    const home = new Home(Cypress.env('API_BASE_URL'));
    const collectionId = new CollectionId(Cypress.env('API_BASE_URL'));

    let tasksRes: GetTasksResponce;

    before(() => {
        cy.fixture('home.json').then((fixtureData: GetTasksResponce) => {
            tasksRes = fixtureData;
        });
    });

    beforeEach(() => {
        interceptDeleteTaskId(tasksRes);
        interceptTasks(tasksRes);
        interceptTaskId();
        cy.visit('/');
        cy.wait('@getTasks');
    });

    it('and see homePage panel', () => {
        home.Panel.should('exist');
    });

    it('and see placeholder', () => {
        home.Placeholder.should('exist');
    });

    it('if there is tasks show history', () => {
        if (tasksRes.tasks.length) {
            home.History.should('exist');
        } else {
            home.History.should('not.exist');
        }
    });

    it('click on task and redirect to task page', () => {
        if (tasksRes.tasks.length) {
            home.HistoryList.children().first().click();
        }
        cy.wait('@getTaskId');
        collectionId.Panel.should('exist');
    });

    // it('if there is tasks show history can delete task', () => {
    //     if (tasksRes.tasks.length) {
    //         home.TaskActionSheet.first().click();
    //         home.DeleteTaskAction.click();
    //         cy.get('.vkuiAlert__actions').contains('Удалить сбор').click();
    //     };

    //     cy.wait('@deleteTaskId');

    //     home.HistoryList.should('have.length', 2);
    // });
});
