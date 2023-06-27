// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'lodash.omit';

import { TaskService } from './TaskService';

const fakeTask = {
    name: 'Задание по сбору документов',
    description: 'Документы для поездки',
    unlimited: true,
    deadLine: 1678362662,
};

const taskService = new TaskService();

describe('Test endpoint (GET /task/:id) on actual data after mutation', () => {
    it('(POST /task)', () => {
        taskService.createTask(fakeTask).then((createdTaskResponse) => {
            const createdTask = createdTaskResponse.body;

            taskService.getTaskById(createdTask.id).then((taskResponse) => {
                const receivedTask = taskResponse.body;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                const preparedCreatedTask = omit(createdTask, 'consolidatedData');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                const preparedReceivedTask = omit(receivedTask, 'consolidatedData');

                expect(preparedCreatedTask).to.deep.eq(preparedReceivedTask);
            });
        });
    });

    it('(PATCH /task)', () => {
        taskService.createTask(fakeTask).then((createdTaskResponse) => {
            const createdTask = createdTaskResponse.body;

            const newTaskName = 'AZAZAZAZA lol kek';

            taskService
                .updateTaskById(createdTask.id, { name: newTaskName })
                .then((updatedTaskResponse) => {
                    const updatedTask = updatedTaskResponse.body;

                    taskService.getTaskById(createdTask.id).then((receivedTaskResponse) => {
                        const receivedTask = receivedTaskResponse.body;

                        const preparedUpdatedTask = {
                            ...updatedTask,
                            name: newTaskName,
                        };

                        expect(preparedUpdatedTask).to.deep.eq(receivedTask);
                    });
                });
        });
    });
});

describe('Test endpoint (GET /task-result/:id) on actual data after mutation', () => {
    it('(PUT /task/assign)', () => {
        taskService.createTask(fakeTask).then((createdTaskResponse) => {
            const createdTask = createdTaskResponse.body;
            const userIdsFofAssign = [1845486, 3911458];

            cy.wait(1000);

            taskService.assignUsersOnTask(createdTask.id, userIdsFofAssign).then(() => {
                taskService.getTaskResultById(createdTask.id).then((taskResultsResponse) => {
                    const { taskResults } = taskResultsResponse.body;
                    const usersWhoAssignOnTheTasks = taskResults.map(
                        (taskResult) => taskResult.testee.vkUserId,
                    );

                    expect(userIdsFofAssign).to.have.all.members(usersWhoAssignOnTheTasks);
                });
            });
        });
    });
});
