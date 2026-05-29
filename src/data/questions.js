export const getPreparedQuestions = () => {
    return [
        { id: 'q-capital-th', prompt: 'What is the capital of Thailand?', expectedAnswer: 'Bangkok' },
        { id: 'q-capital-jp', prompt: 'What is the capital of Japan?', expectedAnswer: 'Tokyo' },
        { id: 'q-js-let', prompt: 'In JavaScript, which keyword declares a block-scoped variable?', expectedAnswer: 'let' },
        { id: 'q-js-const', prompt: 'In JavaScript, which keyword declares a block-scoped constant?', expectedAnswer: 'const' },
        { id: 'q-css-flex', prompt: 'In CSS, which property enables flex layout on an element?', expectedAnswer: 'display' },
        { id: 'q-css-grid', prompt: 'In CSS, which value of display enables grid layout?', expectedAnswer: 'grid' },
        { id: 'q-http-get', prompt: 'Which HTTP method is commonly used to read data?', expectedAnswer: 'GET' },
        { id: 'q-http-post', prompt: 'Which HTTP method is commonly used to create data?', expectedAnswer: 'POST' },
        { id: 'q-html-semantics', prompt: 'Which HTML element represents the main content of a document?', expectedAnswer: 'main' },
        { id: 'q-git-branch', prompt: 'Which git command lists local branches by default?', expectedAnswer: 'git branch' },
    ];
};

