import type { type GetTaskIdResponce, type GetTaskResultsResponce } from '../../../src/app/types';
import { TaskStatusTypesForOrganizer } from '../../../src/app/types';
import CollectionId from '../../pages/CollectionId';
import Common from '../../pages/Common';
import Create from '../../pages/Create';
import Home from '../../pages/Home';
import { interceptTaskId, interceptTaskIdResults } from '../interceptors';

describe('User can visit collectionId page', () => {
    const create = new Create(Cypress.env('API_BASE_URL'));
    const collectionId = new CollectionId(Cypress.env('API_BASE_URL'));
    const common = new Common();
    const home = new Home(Cypress.env('API_BASE_URL'));

    let taskResultsData: GetTaskResultsResponce;
    let taskData: GetTaskIdResponce;

    let isTaskClosed: boolean;
    let completedUsers: number;
    let notCompletedUsers: number;

    before(() => {
        cy.fixture('taskResults.json').then((fixtureData: GetTaskResultsResponce) => {
            taskResultsData = fixtureData;
        });
        cy.fixture('task.json').then((fixtureData: GetTaskIdResponce) => {
            taskData = fixtureData;

            isTaskClosed = taskData.status === TaskStatusTypesForOrganizer.DONE;
            completedUsers = taskData.consolidatedData.executedUsersCount || 0;
            notCompletedUsers =
                taskData.consolidatedData.notExecutedUsersCount +
                    taskData.consolidatedData.partiallyExecutedUsersCount || 0;
        });
    });

    beforeEach(() => {
        interceptTaskIdResults(taskResultsData);
        interceptTaskId(taskData);
        cy.visit('/#/collectionId/08ef58ee-18e4-452d-ac23-f9482c5d2bef');
    });

    it('and see createPage panel', () => {
        collectionId.Panel.should('exist');
    });

    it('and see correct title of task and correct task status', () => {
        collectionId.HeaderContent.should('contain.text', taskData.name);
        collectionId.HeaderContent.should('contain.text', 'Активное задание');
    });

    it('and see searchBar', () => {
        collectionId.SearchBar.should('exist');
    });

    it('and see copyLink button', () => {
        if (!isTaskClosed) {
            collectionId.CopyLink.should('exist');
        } else {
            collectionId.CopyLink.should('not.exist');
        }
    });

    it('and see tabs', () => {
        collectionId.Tabs.should('exist');
        collectionId.Tabs.should('contain.text', `Не прислали ${notCompletedUsers}`);
        collectionId.Tabs.should('contain.text', `Прислали ${completedUsers}`);
    });

    it('and see correct data in notCompleted tab', () => {
        collectionId.Tabs.contains('Не прислали').click();

        if (!isTaskClosed) {
            collectionId.AddTesteesButton.should('exist');

            if (notCompletedUsers > 0) collectionId.RemindAllButton.should('exist');
        }

        collectionId.MembersList.children().should('have.length', notCompletedUsers);
    });

    it('and see correct data in сompleted tab', () => {
        collectionId.Tabs.contains('Прислали').click();

        collectionId.MembersList.children().should('have.length', completedUsers);
    });

    it('and see correct footer', () => {
        if (!isTaskClosed) {
            collectionId.Footer.contains('Завершить сбор');
        }
    });
});
