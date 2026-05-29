export const createAnswerValidator = () => {
    const normalizeAnswer = (text) => {
        return String(text ?? '')
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase();
    };

    const isAnswerCorrect = ({ userAnswer, expectedAnswer }) => {
        return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer);
    };

    return Object.freeze({
        normalizeAnswer,
        isAnswerCorrect,
    });
};

