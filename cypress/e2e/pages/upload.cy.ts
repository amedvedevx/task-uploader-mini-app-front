import { TaskStatusTypesForOrganizer } from '../../../src/app/types';
import type { GetTaskIdResponce } from '../../../src/app/types';
import Upload from '../../pages/Upload';
import { interceptTaskId } from '../interceptors';

describe('User can visit upload page', () => {
    const upload = new Upload(Cypress.env('API_BASE_URL'));

    let taskData: GetTaskIdResponce;

    let isTaskClosed: boolean;
    let files: File[];

    before(() => {
        cy.fixture('task.json').then((fixtureData: GetTaskIdResponce) => {
            taskData = fixtureData;

            isTaskClosed = taskData.status === TaskStatusTypesForOrganizer.DONE;
        });
    });

    beforeEach(() => {
        interceptTaskId(taskData);
        cy.visit('/#/upload/08ef58ee-18e4-452d-ac23-f9482c5d2bef');
    });

    it('and see uploadPage panel', () => {
        upload.Panel.should('exist');
    });

    it('and see correct title of task and owner of task', () => {
        upload.HeaderContent.should('contain.text', 'Сбор документов');
        upload.HeaderContent.should('contain.text', `запрашивает ${taskData.owner.fullName}`);
    });

    it('and see correct task description', () => {
        if (taskData.description) {
            upload.TaskDescription.should('contain.text', taskData.description);
        }
        upload.TaskDescription.should('contain.text', taskData.name);
    });

    it('and see that when the file is loaded, the file gets into the list', () => {
        cy.get('input[type=file][multiple]')
            .first()
            .selectFile(
                [
                    {
                        contents: 'cypress/fixtures/Screenshot.png',
                    },
                ],
                { force: true },
            )
            .then(($input) => {
                files = $input[0].files;

                upload.FilesList.children().should('have.length', files.length);
                upload.CellFile.children().contains(files[0].name);
            });
    });

    it('and see that when sending a file', () => {
        cy.get('input[type=file][multiple]')
            .first()
            .selectFile(
                [
                    {
                        contents: 'cypress/fixtures/Screenshot.png',
                    },
                ],
                { force: true },
            )
            .then(($input) => {
                files = $input[0].files;

                upload.FilesList.children().should('have.length', files.length);
                upload.SendButton.click();
            });
    });

    it('and see that sending file with drag and drop', () => {
        cy.get('input[type=file][multiple]')
            .first()
            .selectFile(
                [
                    {
                        contents: 'cypress/fixtures/Screenshot.png',
                    },
                ],
                { force: true, action: 'drag-drop' },
            )
            .then(($input) => {
                files = $input[0].files;

                upload.FilesList.children().should('have.length', files.length);
                upload.SendButton.click();
            });
    });

    it('and see correct drop zone after closing task', () => {
        if (!isTaskClosed) {
            cy.visit('/#/upload/2d9369e7-0342-47ee-b4b5-a51d6cdaddab');
            upload.PlaceholderCompleted.first().contains('Сбор завершен');
        }
    });

    it('and see corrcet delete file', () => {
        cy.get('input[type=file][multiple]')
            .first()
            .selectFile(
                [
                    {
                        contents: 'cypress/fixtures/Screenshot.png',
                    },
                ],
                { force: true },
            )
            .then(($input) => {
                files = $input[0].files;

                upload.FilesList.children().should('have.length', files.length);
                upload.CellFile.get('.vkuiIconButton').click();
            });
    });

    it('if the user clicks cancel, the selected files will be deleted', () => {
        cy.get('input[type=file]')
            .first()
            .selectFile('cypress/fixtures/Screenshot.png', { force: true });
        upload.CancelButton.click();
    });
});
