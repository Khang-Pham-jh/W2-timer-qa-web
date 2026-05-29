export const normalizeAnswer = (text) => {
    return String(text ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
};

export const isAnswerCorrect = ({ userAnswer, expectedAnswer }) => {
    return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer);
};
