export const createQuestionBank = (preparedQuestions) => {
    const questions = Array.isArray(preparedQuestions) ? preparedQuestions.map((question) => ({ ...question })) : [];
    const usedQuestionIds = new Set();

    const getCounts = () => ({
        total: questions.length,
        remaining: Math.max(0, questions.length - usedQuestionIds.size),
    });

    const resetUsedQuestions = () => {
        usedQuestionIds.clear();
    };

    const getRandomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

    const getRandomUnusedQuestion = () => {
        if (!questions.length) {
            return null;
        }
        if (usedQuestionIds.size >= questions.length) {
            resetUsedQuestions();
        }

        const unusedQuestions = questions.filter((question) => !usedQuestionIds.has(question.id));
        if (!unusedQuestions.length) {
            resetUsedQuestions();
            return getRandomUnusedQuestion();
        }

        const selectedQuestion = unusedQuestions[getRandomInt(unusedQuestions.length)];
        usedQuestionIds.add(selectedQuestion.id);
        return { ...selectedQuestion };
    };

    return Object.freeze({
        getRandomUnusedQuestion,
        resetUsedQuestions,
        getCounts,
    });
};

