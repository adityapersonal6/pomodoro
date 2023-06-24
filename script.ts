// Timer state
let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let countDownWorkTime = workTime;
let countDownBreakTime= breakTime;
let isWorking = true; // Flag to track if currently in work period
let timerId: number | undefined; // Timer ID for setInterval

// DOM elements
const timerDisplay = document.getElementById("timer-display") as HTMLHeadingElement;
const taskNameDisplay = document.getElementById("task-name") as HTMLParagraphElement;
const statusDisplay = document.getElementById("status") as HTMLParagraphElement;
const taskNameInput = document.getElementById("task-name-input") as HTMLInputElement;
const startButton = document.getElementById("start-button") as HTMLButtonElement;
const stopButton = document.getElementById("stop-button") as HTMLButtonElement;

// Audio alert
const alertSound = new Audio('./alert.mp3');

// Update the timer display
function updateTimerDisplay(time: number) {
  const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Play audio alert
function ring() {
  alertSound.play();
}

// Period history
const periodHistory: Record<string, { workPeriods: number, breakPeriods: number, totalTime: number, }> = {};

function togglePeriod() {
  isWorking = !isWorking;

  const taskName = taskNameDisplay.textContent || "";
  if (!periodHistory.hasOwnProperty(taskName)) {
    periodHistory[taskName] = { workPeriods: 0, breakPeriods: 0, totalTime: 0 };
  }

  if (isWorking) {
    periodHistory[taskName].breakPeriods++;
    periodHistory[taskName].totalTime += breakTime / 60;
    taskNameDisplay.textContent = taskNameInput.value || "Work";
    statusDisplay.textContent = "Gambatte Kudasai!!!";
    updateTimerDisplay(workTime);
  } else {
    periodHistory[taskName].workPeriods++;
    periodHistory[taskName].totalTime += workTime / 60;
    taskNameDisplay.textContent = taskNameInput.value || "Break";
    statusDisplay.textContent = "On a Break";
    updateTimerDisplay(breakTime); 
  }

  ring(); // Play audio alert

  updatePeriodHistory(); // Update period history on the UI
  console.log("Period History:", periodHistory);
}


// Function to update the period history display
function updatePeriodHistory() {
  const periodList = document.getElementById("period-list") as HTMLTableElement;
  periodList.innerHTML = "";

  const headerRow = document.createElement("tr");
  const headers = ["Task Name", "Work Periods", "Break Periods", "Total Time (minutes)"];
  headers.forEach(headerText => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  periodList.appendChild(headerRow);

  for (const taskName in periodHistory) {
    if (periodHistory.hasOwnProperty(taskName)) {
      const periods = periodHistory[taskName];
      const dataRow = document.createElement("tr");
      const taskNameCell = document.createElement("td");
      taskNameCell.textContent = taskName;
      dataRow.appendChild(taskNameCell);

      const workPeriodsCell = document.createElement("td");
      workPeriodsCell.textContent = periods.workPeriods.toString();
      dataRow.appendChild(workPeriodsCell);

      const breakPeriodsCell = document.createElement("td");
      breakPeriodsCell.textContent = periods.breakPeriods.toString();
      dataRow.appendChild(breakPeriodsCell);

      const totalTimeCell = document.createElement("td");
      totalTimeCell.textContent = periods.totalTime.toString();
      dataRow.appendChild(totalTimeCell);

      periodList.appendChild(dataRow);
    }
  }
}


// Start the timer
function startTimer() {
  if (timerId) return; // Timer is already running

  timerId = setInterval(() => {
    if (isWorking) {
      statusDisplay.textContent = "Gambatte Kudasai!!!";
      countDownWorkTime--;
      updateTimerDisplay(countDownWorkTime);
      if (countDownWorkTime <= 0) {
        clearInterval(timerId);
        timerId = undefined;
        togglePeriod();
        if (!isWorking) {
          // Reset workTime to initial value after break period
          countDownBreakTime = breakTime; // Change to the desired initial work time

          startTimer(); // Start the break timer
        }
      }
    } else {
      countDownBreakTime--;
      updateTimerDisplay(countDownBreakTime);
      if (countDownBreakTime <= 0) {
        clearInterval(timerId);
        timerId = undefined;
        togglePeriod();
        if (isWorking) {
          // Reset workTime to initial value after break period
          countDownWorkTime = workTime; // Change to the desired initial work time

          startTimer(); // Start the work timer
        }
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
taskNameInput.addEventListener("input", () => {
  if (!isWorking) {
    taskNameDisplay.textContent = taskNameInput.value || "Break";
  } else {
    taskNameDisplay.textContent = taskNameInput.value || "Work";
  }
});

// Initialize timer display
updateTimerDisplay(workTime);

// Update period history display initially
updatePeriodHistory();