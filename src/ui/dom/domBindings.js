const assertRequiredElement = (element, { name }) => {
    if (!element) {
        throw new Error(`Missing required DOM element: ${name}`);
    }
    return element;
};

export const createDomBindings = () => {
    const dom = {
        timerDisplay: document.getElementById('timerDisplay'),
        questionText: document.getElementById('questionText'),
        answerForm: document.getElementById('answerForm'),
        answerInput: document.getElementById('answerInput'),
        resultMessage: document.getElementById('resultMessage'),
        startButton: document.getElementById('startButton'),
        submitButton: document.getElementById('submitButton'),
        resetButton: document.getElementById('resetButton'),
    };

    assertRequiredElement(dom.timerDisplay, { name: 'timerDisplay' });
    assertRequiredElement(dom.questionText, { name: 'questionText' });
    assertRequiredElement(dom.answerForm, { name: 'answerForm' });
    assertRequiredElement(dom.answerInput, { name: 'answerInput' });
    assertRequiredElement(dom.resultMessage, { name: 'resultMessage' });
    assertRequiredElement(dom.startButton, { name: 'startButton' });
    assertRequiredElement(dom.submitButton, { name: 'submitButton' });
    assertRequiredElement(dom.resetButton, { name: 'resetButton' });

    return Object.freeze(dom);
};

