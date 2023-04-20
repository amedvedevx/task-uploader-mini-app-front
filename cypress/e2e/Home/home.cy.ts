
import Home from '../../pages/Home';
import { interceptTasks } from '../interceptors';

describe('User can visit home page', () => {
    const home = new Home(Cypress.env('API_BASE_URL'));

    // before(() => {
    //     cy.fixture('diary.json').then((fixtureData: DiaryResponse) => {
    //         diaryData = fixtureData;
    //     });
    // });

    beforeEach(() => {
        cy.visit('/');
        interceptTasks();
    });

    it('and see homePage panel', () => {
        home.Panel.should('exist');
    });

    it('and see placeholder', () => {
        home.Placeholder.should('exist');
    });

    // it('and see answer variants', () => {
    //     diary.diaryAnswers.should('exist');
    //     diaryData?.actions.forEach((answer) => diary.diaryAnswers.contains(answer.text));
    // });

    // diaryData?.actions.forEach((answer, index) => {
    //     it(`and click answer${index + 1} and get response`, () => {
    //         diary.diaryAnswers.contains(answer.text);
    //         diary.diaryAnswers.get(`:nth-child(${index + 1}) > .vkuiButton__in`).click();
    //         diary.diaryChat.contains(answer.text);
    //         diary.diaryChat.contains(answer.answer);
    //     });
    // });
});
