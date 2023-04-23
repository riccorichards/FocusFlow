//! Pomodoro
const startPomodoro = document.getElementById('btnStartPomodoro');
const resetPomodoro = document.getElementById('btnResetPomodoro');
const pausePomodoro = document.getElementById('btnPausePomodoro');
const minPomodoroWork = document.getElementById('minPomodoroWork');
const secPomodoroWork = document.getElementById('secPomodoroWork');
const minPomodoroBreak = document.getElementById('minPomodoroBreak');
const secPomodoroBreak = document.getElementById('secPomodoroBreak');

let timerID = null;
let isTimerRunning = false;

let cycleCount = parseInt(localStorage.getItem('cycleCount')) || 0;
document.getElementById('cycle').innerText = cycleCount.toString(); document.getElementById('cycle').innerText = cycleCount.toString();

let isFirstCycle = true

const smoothTimer = (endTime, displayMinutes, displaySeconds, onCycleComplete, isBreakCycle) => {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft < 0) {
        displayMinutes.innerText = "00";
        displaySeconds.innerText = "00";
        clearInterval(timerID);
        isTimerRunning = false;
        onCycleComplete(isBreakCycle);

        // Reset work and break time HTML values if the first work timer is starting
        if (isFirstCycle && !isBreakCycle) {
            minPomodoroWork.innerText = '25';
            secPomodoroWork.innerText = '00';
            isFirstCycle = false;
        } else if (!isFirstCycle && !isBreakCycle) {
            minPomodoroBreak.innerText = '05';
            secPomodoroBreak.innerText = '00';
        }

        return; 

    }

    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    displayMinutes.innerText = minutes.toString().padStart(2, '0');
    displaySeconds.innerText = seconds.toString().padStart(2, '0');

    timerID = requestAnimationFrame(() => {
        smoothTimer(endTime, displayMinutes, displaySeconds, onCycleComplete, isBreakCycle);
    });


};

const startTimer = () => {
    let workTime = parseInt(minPomodoroWork.innerText) * 60 + parseInt(secPomodoroWork.innerText);
    let breakTime = parseInt(minPomodoroBreak.innerText) * 60 + parseInt(secPomodoroBreak.innerText);

    // If both workTime and breakTime are zero, reset the timer
    if (workTime === 0 && breakTime === 0) {
        resetTimer();
        return;
    }

    isTimerRunning = true;

    if (workTime > 0) {
        const endTime = new Date().getTime() + workTime * 1000;
        smoothTimer(endTime, minPomodoroWork, secPomodoroWork, (isBreakCycle) => {
            if (!isBreakCycle) {
                cycleCount++;
                document.getElementById('cycle').innerText = cycleCount.toString();
            }

            // When work timer reaches 0, switch to break timer
            if (breakTime > 0) {
                const endTime = new Date().getTime() + breakTime * 1000;
                smoothTimer(endTime, minPomodoroBreak, secPomodoroBreak, () => {
                    // When break timer reaches 0, switch back to work timer
                    const initialWorkTime = 25 * 60;
                    const initialBreakTime = 5 * 60;
                    minPomodoroWork.innerText = Math.floor(initialWorkTime / 60).toString().padStart(2, '0');
                    secPomodoroWork.innerText = (initialWorkTime % 60).toString().padStart(2, '0');
                    minPomodoroBreak.innerText = Math.floor(initialBreakTime / 60).toString().padStart(2, '0');
                    secPomodoroBreak.innerText = (initialBreakTime % 60).toString().padStart(2, '0');
                    startTimer();
                }, true);
            } else {
                // When both work and break timers have reached 0, reset the timer
                resetTimer();
            }
        }, false);
    } else if (breakTime > 0) {
        const endTime = new Date().getTime() + breakTime * 1000;
        smoothTimer(endTime, minPomodoroBreak, secPomodoroBreak, (isBreakCycle) => {
            if (!isBreakCycle) {
                cycleCount++;
                document.getElementById('cycle').innerText = cycleCount.toString();
            }

            // When break timer reaches 0, switch back to work timer
            const initialWorkTime = 25 * 60;
            const initialBreakTime = 5 * 60;
            minPomodoroWork.innerText = Math.floor(initialWorkTime / 60).toString().padStart(2, '0');
            secPomodoroWork.innerText = (initialWorkTime % 60).toString().padStart(2, '0');
            minPomodoroBreak.innerText = Math.floor(initialBreakTime / 60).toString().padStart(2, '0');
            secPomodoroBreak.innerText = (initialBreakTime % 60).toString().padStart(2, '0');
            startTimer();
        }, true);
    }
};

const stopTimer = () => {
    cancelAnimationFrame(timerID);
    isTimerRunning = false;
};

const resetTimer = () => {
    // Save cycle count to localStorage
    localStorage.setItem('cycleCount', cycleCount);

    cycleCount = 0;
    document.getElementById('cycle').innerText = cycleCount.toString();
    minPomodoroWork.innerText = '25';
    secPomodoroWork.innerText = '00';
    minPomodoroBreak.innerText = '05';
    secPomodoroBreak.innerText = '00';
    stopTimer();
};

startPomodoro.addEventListener('click', () => {
    if (!isTimerRunning) {
        startTimer();
    } else {
        alert('Timer is already running.');
    }
});

pausePomodoro.addEventListener('click', () => {
    stopTimer();
});

resetPomodoro.addEventListener('click', () => {
    resetTimer();
});

//! timer ////////////////////////////////////////////////////////////////
const StartTimer = document.querySelector('.StartTimer');
const StopTimer = document.querySelector('.StopTimer');
const ClearTimer = document.querySelector('.ClearTimer');

const hrs = document.getElementById('hrs');
const min = document.getElementById('min');
const sec = document.getElementById('sec');

let timerStartTime;
let savedElapsedTime = moment.duration(0);

let timeProgressBar; // define as global variable
let percentage;
let complete = 0;
StartTimer.addEventListener('click', () => {
    if (timerStartTime === undefined) {
        let startTime = moment();
        timerStartTime = setInterval(() => {
            let now = moment();
            let elapsedTime = moment.duration(now.diff(startTime)).add(savedElapsedTime);

            let hours = elapsedTime.hours();
            let minutes = elapsedTime.minutes();
            let seconds = elapsedTime.seconds();

            hrs.textContent = hours.toString().padStart(2, '0');
            min.textContent = minutes.toString().padStart(2, '0');
            sec.textContent = seconds.toString().padStart(2, '0');

            timerHours = Math.floor(elapsedTime.asHours());
        }, 1000)
    } else {
        alert('Timer is already running');
    }
})

StopTimer.addEventListener('click', () => {
    functionStopTimer();
    savedElapsedTime = moment.duration({
        hours: parseInt(hrs.textContent),
        minutes: parseInt(min.textContent),
        seconds: parseInt(sec.textContent)
    });
    timerHours = Math.floor(savedElapsedTime.asHours());
    timerStartTime = undefined;
})
let quality = 0;



function upgradeParcentage() {
    functionStopTimer();
    const hours = parseInt(hrs.textContent);
    if (hours > 5) {
        if (confirm('Are you sure you want to save the timer?')) {
            percentage = (hours / 12) * 100;
            const amountOfTasks = tasks.length;
            const amountOfDone = tasks.filter(task => task.done).length;
            complete = amountOfTasks === 0 ? 0 : Math.floor((amountOfDone / amountOfTasks) * 100);
            // Use the percentage to update the progress bar
            upgradeQuality(percentage, complete);
            quality = (percentage + complete) / 2;
            timeProgressBar.data.datasets[0].data = [percentage, 100 - percentage];
            document.getElementById('time-progress-value').textContent = `${percentage}%`
            timeProgressBar.update();
            sec.textContent = '00';
            min.textContent = '00';
            hrs.textContent = '00';
            savedElapsedTime = moment.duration(0);
            timerStartTime = undefined;
            updateProgressBar();
            console.log(quality)
            console.log(complete)
            console.log(percentage)
        } else {
            sec.textContent = '00';
            min.textContent = '00';
            hrs.textContent = '00';
            savedElapsedTime = moment.duration(0);
            timerStartTime = undefined;
        }
    } else {
        alert('It takes 5 hours or more to store value');
        sec.textContent = '00';
        min.textContent = '00';
        hrs.textContent = '00';
        savedElapsedTime = moment.duration(0);
        timerStartTime = undefined;
    }


}

function upgradeQuality(percentage, complete) {
    percentage = percentage || 0;
    complete = complete || 0;
    quality = (percentage + complete) / 2;
    document.getElementById('quality-progress-value').textContent = `${quality}%`;
    qualityProgressBar.data.datasets[0].data = [quality, 100 - quality];
    qualityProgressBar.update();
    updateProgressBar();
}

ClearTimer.addEventListener('click', upgradeParcentage);


function functionStopTimer() {
    clearInterval(timerStartTime);
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave the page? Your timer will be reset.';
});



//! To Do List ///////////////////////////////////////////////////////////

const addTask = document.getElementById('btnToDoAdd');
const done = document.querySelector('.bi-check2-all');
const delTask = document.querySelector('.bi-trash3');
const valueOfToDo = document.getElementById('inputToDo')
const TaskList = document.querySelector('.Tasklist')
const form = document.getElementById('form');

let tasks = [];



if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(task => {
    const cssClass = task.done ? 'status done' : 'status'

    const taskHTML = `<li id="${task.id}">
    <p class="${cssClass}">${task.text}</p>
    <div class="icon">
       <i class="bi bi-check2-all" data-action="done"></i>
        <i class="bi bi-trash3" data-action="delete"></i>
    </div>
   </li>`


    TaskList.insertAdjacentHTML("beforeend", taskHTML);
})

form.addEventListener('submit', addTodoTasks)
TaskList.addEventListener('click', deleteTask);
TaskList.addEventListener('click', doneTask);

function addTodoTasks(e) {
    e.preventDefault();
    const value = valueOfToDo.value
    const newTask = {
        id: Date.now(),
        text: value,
        done: false
    }

    tasks.push(newTask);
    const cssClass = newTask.done ? 'status done' : 'status'

    const task = `<li id="${newTask.id}">
    <p class="${cssClass}">${newTask.text}</p>
    <div class="icon">
       <i class="bi bi-check2-all" data-action="done"></i>
        <i class="bi bi-trash3" data-action="delete"></i>
    </div>
   </li>`


    TaskList.insertAdjacentHTML("beforeend", task);

    valueOfToDo.value = '';
    saveLocalStorage();
    updateProgressBar();
    upgradeQuality();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return;
    const node = e.target.closest('li');
    const id = Number(node.id);
    const index = tasks.findIndex(task => task.id === id)

    tasks.splice(index, 1);
    node.remove();
    saveLocalStorage();
    updateProgressBar();
    upgradeQuality();
}

function doneTask(e) {
    if (e.target.dataset.action !== 'done') return;
    const done = e.target.closest('li');
    const one = done.querySelector('.status');
    one.classList.toggle('done');
    const id = Number(done.id);
    const task = tasks.find(task => task.id === id);
    task.done = !task.done
    saveLocalStorage();
    updateProgressBar();
    upgradeQuality();
}

function saveLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


////////////////////////////////! Result ///////////////////////////////

timeProgressBar = undefined;
timeProgressBar = new Chart(document.getElementById('time-progress-bar'), {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [0, 100],
            backgroundColor: ['aqua', 'transparent'],
            borderWidth: 0.08
        }]
    },
    options: {
        cutoutPercentage: 75,
        responsive: false,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeOutBounce'
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});

let completeProgressBar = new Chart(document.getElementById('complete-progress-bar'), {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [0, 100],
            backgroundColor: ['aqua', 'transparent'],
            borderWidth: 0.08
        }]
    },
    options: {
        cutoutPercentage: 75,
        responsive: false,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeOutBounce'
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});


function updateProgressBar() {
    const amountOfTasks = tasks.length;
    const amountOfDone = tasks.filter(task => task.done).length;
    complete = amountOfTasks === 0 ? 0 : Math.floor((amountOfDone / amountOfTasks) * 100);
    completeProgressBar.data.datasets[0].data = [complete, 100 - complete];
    document.getElementById('complete-progress-value').textContent = `${complete}%`;
    completeProgressBar.update();
}

const qualityProgressBar = new Chart(document.getElementById('quality-progress-bar'), {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [0, 100],
            backgroundColor: ['aqua', 'transparent'],
            borderWidth: 0.08
        }]
    },
    options: {
        cutoutPercentage: 75,
        responsive: false,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeOutBounce'
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});
