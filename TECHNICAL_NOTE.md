# Technical Note -- Architecture (Timer Q&A Practice)

## Purpose

- Explain the module boundaries and the rules to follow when changing or refactoring this project.

## Non-goals

- Not a "how to run" guide (see `README.md`).
- Not a UI/UX spec (the source of truth is `index.html` + `src/ui/**`).

## Architecture at a glance

- `index.html` is the static shell and loads the app entry `src/app/index.js`.
- `src/app/**` orchestrates the application (wires modules, binds events, controls flow).
- `src/core/**` is reusable business logic (must not access DOM APIs).
- `src/ui/**` is DOM-only code (query, render, enable/disable controls, styles).
- `src/data/**` provides prepared data (questions seed).

Dependency direction (keep this):
- `core` must not import `ui` or `app`.
- `ui` may import shared constants from `core/constants`.
- `app` may import `core`, `ui`, and `data` and is the composition root.

Note:
- `main.js` is a compatibility shim that imports `src/app/index.js` (safe to delete if unused).

## State ownership (who owns what)

- `src/core/timer/timer.js` owns: `elapsedSeconds`, `intervalId`.
- `src/core/questions/questionBank.js` owns: `questions` (internal copy), `usedQuestionIds`.
- `src/app/controller/gameController.js` owns: `currentQuestion`, `mode` (interaction state).

## Single source of truth (constants)

- `src/core/constants/interactionState.js` defines:
  - `INTERACTION_STATE` (`idle` / `answering` / `submitted`)
  - `RESULT_STATUS` (`info` / `success` / `danger`)
- UI and controller must use these constants (do not redefine state/status elsewhere).

## Module contracts (public APIs)

- `src/core/timer/timer.js`
  - `start({ onTick })`, `stop()`, `reset()`, `isRunning()`, `getElapsedSeconds()`, `getFormattedTime()`
- `src/core/questions/questionBank.js`
  - `getRandomUnusedQuestion()`, `resetUsedQuestions()`, `getCounts()`
- `src/core/validation/answerValidator.js`
  - `normalizeAnswer(text)`, `isAnswerCorrect({ userAnswer, expectedAnswer })`
- `src/ui/render/uiRenderer.js`
  - `renderTimer(text)`, `renderQuestion(promptText)`, `renderResult({ status, message })`, `clearResult()`
  - `setInteractionState(state)`, `setAnswerInputValue(value)`, `focusAnswerInput()`
- `src/app/controller/gameController.js`
  - `startRound()`, `submitAnswer()`, `resetGame()`

Keep these contracts stable unless you update all call sites in `src/app/index.js`.

## Control flow (what happens on each action)

- Start (`gameController.startRound()`)
  - Clear result, pick a question (`questionBank.getRandomUnusedQuestion()`), render prompt, clear input.
  - Reset timer, render `00:00:00`, start ticking; on tick, render formatted time.
  - Switch interaction state to `answering` and focus the input.
- Submit (`gameController.submitAnswer()`)
  - If empty input: show message and keep focusing input.
  - Stop timer, validate answer (`answerValidator.isAnswerCorrect(...)`), render result + elapsed time.
  - Switch interaction state to `submitted`.
- Reset (`gameController.resetGame()`)
  - Stop + reset timer, clear current question.
  - Render default question text, clear input, clear result.
  - Switch interaction state to `idle`.

## Extension points (where new code should go)

- More questions: edit `src/data/questions.js`.
- Scoring/history: add a `src/core/**` module to own the state, call it from `gameController`, render it via `src/ui/**`.
- Persistence (`localStorage`): isolate it in a `src/core/**` storage module; do not spread `localStorage` calls across controller/UI.
- Categories: add `category` to question objects and extend `questionBank` to filter before picking.

## Refactor safety checklist

- Do not introduce DOM access into `src/core/**`.
- Do not duplicate `INTERACTION_STATE` / `RESULT_STATUS`.
- Keep `gameController` as the single owner of app flow; keep `uiRenderer` focused on rendering and control toggling.
- Prefer adding a new small module over growing `gameController` into a "god file".

