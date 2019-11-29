let MACHINE_AMOUNT = 10
let TASK_AMOUNT_MULTIPLIER = [1.5, 2]
let TASK_AMOUNT = []
let TASK_AMOUNT_INDEX = 0

let monFlag = false
let randomTaskFlag = false
let randomParam = 0.5

class Manager {
    constructor(nMachines) {
        this.machines = []
        this.bestSolution = []
        this.makeSpanHistory = []
        this.tasks = []
        for (let i = 0; i < nMachines; i++) {
            this.machines[i] = new Machine()
        }
        for (let i = 0; i < TASK_AMOUNT[TASK_AMOUNT_INDEX]; i++) {
            this.tasks.push(Math.floor((Math.random() * 100) + 1))
        }
        this.machines[0].setTasks(this.tasks);
    }

    getMakespans = () => {
        let spans = []
        this.machines.forEach(machine => {
            spans.push(machine.getLocalMakespan());
        });
        return spans;
    }

    bestMove() {
        this.machines[this.getLowestMakespanIndex()].pushTask(this.machines[this.getGreaterMakespanIndex()].popExpensiveTaskIndex());
    }

    getGreaterMakespanIndex() {
        let mach = 0;
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[mach].getLocalMakespan() < this.machines[i].getLocalMakespan()) {
                mach = i;
            }
        }
        return mach;
    }

    getLowestMakespanIndex() {
        let mach = 0;
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[mach].getLocalMakespan() > this.machines[i].getLocalMakespan()) {
                mach = i;
            }
        }
        return mach;
    }

    getHighMakespan() {
        let higherMakespan = 0;
        this.machines.forEach(machine => {
            if (machine.getLocalMakespan() > higherMakespan) {
                higherMakespan = machine.getLocalMakespan();
            }
        });
        return higherMakespan;
    }

    getNotEmptyMachinesIndex() {
        let notEmptyMachines = [];
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[i].getTasks().length) {
                notEmptyMachines.push(i);
            }
        }
        console.log(notEmptyMachines)
        return notEmptyMachines;
    }

    getRandomExept(uNo) {
        let a = []
        for (let i = 0; i < this.machines.length; i++) {
            a.push(i)
        }
        a.splice(a.indexOf(uNo), 1);
        return a[Math.floor(Math.random() * a.length)]
    }

    randomMove() {
        let a = this.getRandomExept(this.getGreaterMakespanIndex())
        let b = this.getGreaterMakespanIndex()
        if (randomTaskFlag) {
            this.machines[a].pushTask(this.machines[b].popExpensiveTaskIndex())
        } else {
            this.machines[a].pushTask(this.machines[b].popRandomTask())
        }
    }

    distributeTasks() {
        let bestMakespan = Number.POSITIVE_INFINITY
        let currentMakespan;
        let runs = 0;
        let count = 0;
        while (true) {
            if (monFlag) {
                if (Math.random() < randomParam) {
                    this.randomMove();
                } else {
                    this.bestMove();
                }
                currentMakespan = this.getHighMakespan();
                this.makeSpanHistory.push(currentMakespan)
                if (bestMakespan > currentMakespan) {
                    bestMakespan = currentMakespan;
                    runs++
                } else {
                    count++
                }

                if (count >= 1000) {
                    break;
                }
            } else {
                this.bestMove();
                currentMakespan = this.getHighMakespan();
                this.makeSpanHistory.push(currentMakespan)
                count++
                if (bestMakespan > currentMakespan) {
                    bestMakespan = currentMakespan;
                    runs++
                } else {
                    break;
                }
            }
        }
    }
}

function doStuff() {

    MACHINE_AMOUNT = document.getElementById('selectMach').value;
    TASK_AMOUNT_INDEX = document.getElementById('selectTaskMult').value;
    randomParam = document.getElementById('randomProb').value;

    monFlag = (document.getElementById('monFlag').value == 0) ? false : true;
    randomTaskFlag = (document.getElementById('randTaskFlas').value == 0) ? false : true;
    
    for (let i = 0; i < TASK_AMOUNT_MULTIPLIER.length; i++) {
        TASK_AMOUNT[i] = Math.round(Math.pow(MACHINE_AMOUNT, TASK_AMOUNT_MULTIPLIER[i]));
    }

    var start = new Date().getTime();

    var manager = new Manager(MACHINE_AMOUNT)

    manager.distributeTasks();
    manager.machines.forEach(machine => {
        console.log(machine.getTasks(), machine.getLocalMakespan())
    });

    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time + 'ms');
}