// Timer state
let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let isWorking = true; // Flag to track if currently in work period
let timerId; // Timer ID for setInterval
// DOM elements
const timerDisplay = document.getElementById("timer-display");
const taskNameDisplay = document.getElementById("task-name");
const statusDisplay = document.getElementById("status");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
// Update the timer display
function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}
// Toggle between work and break periods
function togglePeriod() {
    isWorking = !isWorking;
    if (isWorking) {
        taskNameDisplay.textContent = "Work";
        statusDisplay.textContent = "Working";
        updateTimerDisplay(workTime);
    }
    else {
        taskNameDisplay.textContent = "Break";
        statusDisplay.textContent = "On a Break";
        updateTimerDisplay(breakTime);
    }
}
// Start the timer
function startTimer() {
    if (timerId)
        return; // Timer is already running
    timerId = setInterval(() => {
        if (isWorking) {
            workTime--;
            updateTimerDisplay(workTime);
            if (workTime <= 0) {
                clearInterval(timerId);
                timerId = undefined;
                togglePeriod();
                startTimer(); // Start the break timer
            }
        }
        else {
            breakTime--;
            updateTimerDisplay(breakTime);
            if (breakTime <= 0) {
                clearInterval(timerId);
                timerId = undefined;
                togglePeriod();
                startTimer(); // Start the work timer
            }
        }
    }, 1000);
}
// Stop the timer
function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = undefined;
    }
}
// Event listeners
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
// Initialize timer display
updateTimerDisplay(workTime);
