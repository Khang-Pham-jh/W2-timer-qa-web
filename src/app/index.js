import { createAnswerValidator } from '../core/validation/answerValidator.js';
import { createQuestionBank } from '../core/questions/questionBank.js';
import { createTimer } from '../core/timer/timer.js';
import { getPreparedQuestions } from '../data/questions.js';
import { createDomBindings } from '../ui/dom/domBindings.js';
import { createUiRenderer } from '../ui/render/uiRenderer.js';
import { createGameController } from './controller/gameController.js';

const bindEvents = ({ dom, controller }) => {
    dom.startButton.addEventListener('click', () => controller.startRound());
    dom.resetButton.addEventListener('click', () => controller.resetGame());
    dom.answerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        controller.submitAnswer();
    });
};

const init = () => {
    const dom = createDomBindings();
    const ui = createUiRenderer(dom);
    const timer = createTimer();
    const questionBank = createQuestionBank(getPreparedQuestions());
    const validator = createAnswerValidator();

    const controller = createGameController({ timer, questionBank, validator, ui, dom });
    bindEvents({ dom, controller });
    controller.resetGame();
};

init();

