import { INTERACTION_STATE, RESULT_STATUS } from '../../core/constants/interactionState.js';

export const createGameController = ({ timer, questionBank, validator, ui, dom }) => {
    let currentQuestion = null;
    let mode = INTERACTION_STATE.idle;

    const setMode = (nextMode) => {
        mode = nextMode;
        ui.setInteractionState(nextMode);
    };

    const isIdle = () => mode === INTERACTION_STATE.idle;
    const isAnswering = () => mode === INTERACTION_STATE.answering;
    const getUserAnswer = () => dom.answerInput.value;

    const startRound = () => {
        if (isAnswering()) {
            ui.renderResult({ status: RESULT_STATUS.info, message: 'Finish the current question or press Reset.' });
            return;
        }

        ui.clearResult();
        const nextQuestion = questionBank.getRandomUnusedQuestion();

        if (!nextQuestion) {
            ui.renderQuestion('No questions available.');
            ui.renderResult({
                status: RESULT_STATUS.danger,
                message: 'Add prepared questions in src/data/questions.js to start practicing.',
            });
            setMode(INTERACTION_STATE.idle);
            return;
        }

        currentQuestion = nextQuestion;
        ui.renderQuestion(currentQuestion.prompt);
        ui.setAnswerInputValue('');

        timer.stop();
        timer.reset();
        ui.renderTimer(timer.getFormattedTime());
        timer.start({
            onTick: ({ formattedTime }) => {
                ui.renderTimer(formattedTime);
            },
        });

        setMode(INTERACTION_STATE.answering);
        ui.focusAnswerInput();
    };

    const submitAnswer = () => {
        if (isIdle()) {
            ui.renderResult({ status: RESULT_STATUS.info, message: 'Press Start to begin.' });
            return;
        }

        if (!isAnswering()) {
            ui.renderResult({ status: RESULT_STATUS.info, message: 'Press Start for the next question, or Reset.' });
            return;
        }

        const userAnswer = getUserAnswer();
        if (!validator.normalizeAnswer(userAnswer)) {
            ui.renderResult({ status: RESULT_STATUS.danger, message: 'Please type an answer before submitting.' });
            ui.focusAnswerInput();
            return;
        }

        timer.stop();
        const elapsedTime = timer.getFormattedTime();
        const isCorrect = currentQuestion
            ? validator.isAnswerCorrect({ userAnswer, expectedAnswer: currentQuestion.expectedAnswer })
            : false;

        if (!currentQuestion) {
            ui.renderResult({ status: RESULT_STATUS.danger, message: 'No active question. Press Start to begin.' });
            setMode(INTERACTION_STATE.submitted);
            return;
        }

        const correctnessText = isCorrect ? 'Correct' : 'Incorrect';
        const expectedAnswerText = `Expected: "${currentQuestion.expectedAnswer}"`;
        const elapsedTimeText = `Time: ${elapsedTime}`;
        ui.renderResult({
            status: isCorrect ? RESULT_STATUS.success : RESULT_STATUS.danger,
            message: `${correctnessText}. ${expectedAnswerText}. ${elapsedTimeText}.`,
        });

        setMode(INTERACTION_STATE.submitted);
    };

    const resetGame = () => {
        timer.stop();
        timer.reset();
        currentQuestion = null;

        ui.renderTimer(timer.getFormattedTime());
        ui.renderQuestion('Press Start to begin.');
        ui.setAnswerInputValue('');
        ui.clearResult();
        setMode(INTERACTION_STATE.idle);
    };

    return Object.freeze({
        startRound,
        submitAnswer,
        resetGame,
    });
};
