# Timer Q&A Practice 

A small practice app: press **Start** to get a random question and start the timer, type an answer, then **Submit** to stop the timer and see whether you're correct. Use **Reset** to return to the idle state.

## Quick start

Open `problems/W2-D3/index.html` in a browser.

Recommended (avoids ES module/CORS issues):
- VS Code: use **Live Server** extension

## Expected behavior (user flow)

- **Start**
  - Picks a random unused question
  - Clears result, clears input, focuses input
  - Resets timer to `00:00:00` and starts ticking
  - Switches to `answering`
- **Submit**
  - If input is empty: shows a message and keeps focusing the input
  - Otherwise: stops timer, validates answer, shows result + elapsed time
  - Switches to `submitted`
- **Reset**
  - Stops and resets timer
  - Clears input and result
  - Restores default question text
  - Switches to `idle`

## Project structure (where to change what)

- `index.html`: the static shell (markup) and the only script entry it loads (`src/app/index.js`).
- `src/app/`: application wiring and flow orchestration (where browser events are bound).
  - `src/app/index.js`: composition root (creates modules, binds events, starts the app).
  - `src/app/controller/gameController.js`: the state machine for Start/Submit/Reset.
- `src/core/`: reusable business logic (no DOM access).
  - `src/core/constants/interactionState.js`: single source of truth for UI/controller states and result statuses.
  - `src/core/timer/timer.js`: stopwatch + `HH:MM:SS` formatting.
  - `src/core/questions/questionBank.js`: random question selection + no-repeat logic.
  - `src/core/validation/answerValidator.js`: answer normalization + correctness check.
- `src/ui/`: DOM-only concerns (query/render/styles).
  - `src/ui/dom/domBindings.js`: DOM lookup + required-element assertions.
  - `src/ui/render/uiRenderer.js`: render + enable/disable controls.
  - `src/ui/styles/styles.css`: styling.
- `src/data/questions.js`: the prepared questions list (edit here to add more).
- `main.js`: compatibility shim that imports `src/app/index.js` (safe to delete if you don't need it).
- `TECHNICAL_NOTE.md`: deeper notes on the module boundaries and APIs.

## Architecture rules 

- `src/core/**` must not import from `src/ui/**` or `src/app/**` (core stays reusable/testable).
- `src/app/index.js` is the composition root (wires dependencies + binds DOM events).
- UI state values come from `src/core/constants/interactionState.js` (do not duplicate constants in other modules).

## Key modules (responsibilities)

- `src/app/controller/gameController.js`: owns the current question + interaction mode; exposes:
  - `startRound()`, `submitAnswer()`, `resetGame()`
- `src/core/timer/timer.js`: owns timer state; exposes:
  - `start({ onTick })`, `stop()`, `reset()`, `getFormattedTime()`, `isRunning()`
- `src/core/questions/questionBank.js`: owns prepared questions + used tracking; exposes:
  - `getRandomUnusedQuestion()`, `resetUsedQuestions()`, `getCounts()`
- `src/core/validation/answerValidator.js`: normalization + correctness check; exposes:
  - `normalizeAnswer(text)`, `isAnswerCorrect({ userAnswer, expectedAnswer })`
- `src/ui/render/uiRenderer.js`: renders to DOM via `textContent` and toggles UI controls based on state.

## Common changes

- Add/edit questions: `src/data/questions.js`
- Change answer rules (e.g. punctuation handling): `src/core/validation/answerValidator.js`
- Change UI copy/layout: `index.html` and `src/ui/render/uiRenderer.js`
- Change styles: `src/ui/styles/styles.css`

## Debugging checklist

- Timer doesn’t tick:
  - Confirm `startRound()` calls `timer.start(...)` and `onTick` updates `ui.renderTimer(...)`.
- Submit button/input disabled unexpectedly:
  - Check `ui.setInteractionState(...)` usage and `INTERACTION_STATE` values.
- Always “Incorrect”:
  - Check normalization rules in `answerValidator.js` and expected answers in `src/data/questions.js`.
- No questions available:
  - Ensure `getPreparedQuestions()` in `src/data/questions.js` returns a non-empty array.

## Scope / non-goals

- No build step, no external libraries.
- No persistence (no history, scoring, or `localStorage`) unless you add it intentionally.
