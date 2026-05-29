import { INTERACTION_STATE } from '../../core/constants/interactionState.js';

export const createUiRenderer = (dom) => {
    const renderTimer = (text) => {
        dom.timerDisplay.textContent = String(text ?? '');
    };

    const renderQuestion = (promptText) => {
        dom.questionText.textContent = String(promptText ?? '');
    };

    const renderResult = ({ status, message }) => {
        dom.resultMessage.dataset.status = status || '';
        dom.resultMessage.textContent = String(message ?? '');
    };

    const clearResult = () => {
        dom.resultMessage.dataset.status = '';
        dom.resultMessage.textContent = '';
    };

    const setAnswerInputValue = (value) => {
        dom.answerInput.value = String(value ?? '');
    };

    const focusAnswerInput = () => {
        dom.answerInput.focus();
    };

    const setInteractionState = (state) => {
        const interactionState = state || INTERACTION_STATE.idle;
        const isIdle = interactionState === INTERACTION_STATE.idle;
        const isAnswering = interactionState === INTERACTION_STATE.answering;
        const isSubmitted = interactionState === INTERACTION_STATE.submitted;

        dom.startButton.disabled = !isIdle && !isSubmitted;
        dom.answerInput.disabled = !isAnswering;
        dom.submitButton.disabled = !isAnswering;

        if (isIdle) {
            dom.answerInput.setAttribute('aria-disabled', 'true');
        } else {
            dom.answerInput.removeAttribute('aria-disabled');
        }
    };

    return Object.freeze({
        renderTimer,
        renderQuestion,
        renderResult,
        clearResult,
        setInteractionState,
        setAnswerInputValue,
        focusAnswerInput,
    });
};
