# Technical Note -- Timer + Random Q&A Website

This document explains the JavaScript architecture in `problems/W2-D3/src/app/index.js` and its modules.

## A) Module Overview

### `createDomBindings()`
Responsibility:
- Collect all required DOM references in one place.
- Hard-fail early if required elements are missing (predictable failure mode).

### `createTimer({ millisecondsPerTick })`
Responsibility:
- Own stopwatch state.
- Start/stop/reset time.
- Format elapsed time as `HH:MM:SS`.

### `createQuestionBank(preparedQuestions)`
Responsibility:
- Own the prepared questions and the "used questions" tracking.
- Return a random unused question.
- Prevent repeats until all questions have been shown once (then auto-reset).

### `createAnswerValidator()`
Responsibility:
- Normalize answers (trim + collapse whitespace + lowercase).
- Check correctness without side effects.

### `createUiRenderer(dom)`
Responsibility:
- Render timer/question/result using `textContent`.
- Control UI interaction state (`idle` / `answering` / `submitted`).

### `createGameController({ timer, questionBank, validator, ui, dom })`
Responsibility:
- Coordinate game flow (Start -> Answering -> Submit -> Submitted).
- Handle edge cases and keep the UI consistent.
- Own the "current question" and "mode".

## B) Private State

### Timer module (`createTimer`)
Private:
- `elapsedSeconds`
- `intervalId`

### Question bank (`createQuestionBank`)
Private:
- `questions` (internal copy)
- `usedQuestionIds` (`Set`)

### Game controller (`createGameController`)
Private:
- `currentQuestion`
- `mode`

## C) Public API

### Timer API
- `start({ onTick })`
- `stop()`
- `reset()`
- `isRunning()`
- `getElapsedSeconds()`
- `getFormattedTime()`

Why:
- Other modules only need behavior (start/stop/read time), not internal interval details.

### Question bank API
- `getRandomUnusedQuestion()`
- `resetUsedQuestions()`
- `getCounts()`

Why:
- UI and controller depend on "get me a question" behavior, not the data structure.

### Validator API
- `normalizeAnswer(text)`
- `isAnswerCorrect({ userAnswer, expectedAnswer })`

Why:
- Separates business rules from controller flow; easy to evolve later (multiple answers, punctuation rules, etc.).

### UI API
- `renderTimer(text)`
- `renderQuestion(promptText)`
- `renderResult({ status, message })`
- `clearResult()`
- `setInteractionState(state)`
- `setAnswerInputValue(value)`
- `focusAnswerInput()`

Why:
- Controller doesn't manually toggle DOM properties everywhere; it requests intention-level UI changes.

### Controller API
- `startRound()`
- `submitAnswer()`
- `resetGame()`

Why:
- This is the app's "public surface": event handlers call controller methods only.

## D) Refactor/Clean Code Standards Applied

- Meaningful names (e.g. `elapsedSeconds`, `getRandomUnusedQuestion`, `currentQuestion`)
- Small functions with single responsibility (timer vs validation vs UI vs orchestration)
- One responsibility per module (high cohesion, low coupling)
- Encapsulation via closure (no global mutable state)
- Clear public API (modules expose methods, not raw internals)
- Avoid shared mutable state (each state has an owner module)
- Command/query separation (e.g. `getFormattedTime()` vs `resetGame()`)
- Predictable side effects (render/stop/start happen via clearly named commands)
- DOM safety: uses `textContent` (no `innerHTML` for dynamic content)
- Events bound via `addEventListener` (no inline `onclick`)
- Constants instead of magic numbers (e.g. `MILLISECONDS_PER_SECOND`)

## E) How Future Teammates Can Extend This

### Add new questions
- Edit `getPreparedQuestions()` in `src/data/questions.js` to add `{ id, prompt, expectedAnswer }`.

### Add scoring
- Create a `createScoreKeeper()` module with private `score`.
- Controller increments score on correct submit and asks UI to render it.

### Add categories
- Add `category` to each question.
- Add `getRandomUnusedQuestion({ category })` or a `setActiveCategory()` method on the question bank.

### Add `localStorage`
- Add a `createStorage()` module to load/save:
  - used question ids
  - best times or answer history
- Keep storage isolated so the rest of the app doesn't depend on `localStorage` directly.

### Add answer history
- Create a `createAnswerHistory()` module owned by controller.
- Push `{ questionId, userAnswer, expectedAnswer, isCorrect, elapsedSeconds }` on submit.
- UI renders the list from the history module via a small public API.

