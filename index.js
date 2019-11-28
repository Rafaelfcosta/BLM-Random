const MACHINE_AMOUNT = 10;
const TASK_AMOUNT_MULTIPLIER = [1.5, 2];
const TASK_AMOUNT = []

for (let i = 0; i < TASK_AMOUNT_MULTIPLIER.length; i++) {
    TASK_AMOUNT[i] = Math.round(Math.pow(MACHINE_AMOUNT, TASK_AMOUNT_MULTIPLIER[i]));
}

class Machine {
    constructor() {
        this.tasks = []
    }

    setTasks(tasks) {
        this.tasks = tasks
    }

    getTasks() {
        return this.tasks
    }

    getLocalMakespan() {
        return this.tasks.reduce((a, b) => a + b, 0)
    }
}

var machines = [];

let getMakespan = (machines) => {
    machines.forEach(machine => {
        console.log(machine.getLocalMakespan());
    });
}

for (let i = 0; i < MACHINE_AMOUNT; i++) {
    machines.push(new Machine)
}

let tasks = []
for (let i = 0; i < TASK_AMOUNT[0]; i++) {
    tasks.push(Math.floor((Math.random() * 100) + 1))
}

machines[0].setTasks(tasks);

getMakespan(machines)

console.log(machines[0].getLocalMakespan())