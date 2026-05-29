const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

const padTwoDigits = (value) => String(value).padStart(2, '0');

const formatElapsedSeconds = (elapsedSeconds) => {
    const totalSeconds = Number.isFinite(elapsedSeconds) ? Math.max(0, Math.floor(elapsedSeconds)) : 0;
    const hours = Math.floor(totalSeconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
    const minutes = Math.floor((totalSeconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) / SECONDS_PER_MINUTE);
    const seconds = totalSeconds % SECONDS_PER_MINUTE;
    return `${padTwoDigits(hours)}:${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`;
};

export const createTimer = ({ millisecondsPerTick = MILLISECONDS_PER_SECOND } = {}) => {
    let elapsedSeconds = 0;
    let intervalId = null;

    const isRunning = () => intervalId !== null;
    const getElapsedSeconds = () => elapsedSeconds;
    const getFormattedTime = () => formatElapsedSeconds(elapsedSeconds);

    const reset = () => {
        elapsedSeconds = 0;
    };

    const stop = () => {
        if (!isRunning()) {
            return;
        }
        window.clearInterval(intervalId);
        intervalId = null;
    };

    const start = ({ onTick } = {}) => {
        if (isRunning()) {
            return false;
        }
        intervalId = window.setInterval(() => {
            elapsedSeconds += 1;
            if (typeof onTick === 'function') {
                onTick({ elapsedSeconds, formattedTime: getFormattedTime() });
            }
        }, millisecondsPerTick);
        return true;
    };

    return Object.freeze({
        start,
        stop,
        reset,
        isRunning,
        getElapsedSeconds,
        getFormattedTime,
    });
};

