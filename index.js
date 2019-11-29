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
        this.runs = 0
        for (let i = 0; i < nMachines; i++) {
            this.machines[i] = new Machine()
        }
        for (let i = 0; i < TASK_AMOUNT[TASK_AMOUNT_INDEX]; i++) {
            this.tasks.push(Math.floor((Math.random() * 100) + 1))
        }
        this.machines[0].setTasks(this.tasks);
    }

    plot() {
        $("#mk>canvas").remove();
        $("#mk").append('<canvas id="makespanChart"></canvas>');

        $("#mach>canvas").remove();
        $("#mach").append('<canvas id="machinesChart"></canvas>');

        let ctx = document.getElementById('makespanChart').getContext('2d');
        var ctx2 = document.getElementById('machinesChart').getContext('2d');

        let lb = []
        for (let i = 0; i < this.makeSpanHistory.length - 1; i++) {
            lb.push(i);
        }
        let mkhist = this.makeSpanHistory.slice(0, this.makeSpanHistory.length - 1);
        var config = {
            type: 'line',
            data: {
                labels: lb,
                datasets: [{
                    label: 'History Makespan',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: mkhist,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Makespan'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Iteration'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Values'
                        }
                    }]
                }
            }
        };

        let machineLbs = []
        for (let i = 0; i < this.machines.length; i++) {
            machineLbs.push('M' + i)
        }

        let data = []
        for (let i = 0; i < this.bestSolution.length; i++) {
            data[i] = new Object();
            data[i].label = []
            data[i].data = []
            let g = Math.floor(Math.random() * 255)
            let b = Math.floor(Math.random() * 255)
            let ctxt = `rgba(255, ${g}, ${b}, 0.2)`
            data[i].backgroundColor = ctxt
        }
        let j = 0
        data.forEach(d => {
            for (let i = 0; i < this.bestSolution.length; i++) {
                if (this.bestSolution[i].length > j) {
                    d.data.push(this.bestSolution[i][j])
                }
            }
            j++;
        });

        var myChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: machineLbs,
                datasets: data
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]

                }
            }
        });


        new Chart(ctx, config);
    }

    generateOutput(exTime, randParam) {
        let output = new Object();
        var sel = document.getElementById('monFlag');
        var text = sel.options[sel.selectedIndex].text;
        output.heuristic = text
        output.taskAmout = TASK_AMOUNT[TASK_AMOUNT_INDEX]
        output.machineAmount = MACHINE_AMOUNT
        output.replication = 1
        output.time = exTime
        output.iterations = this.runs

        let sum = 0;
        this.machines.forEach(machine => {
            sum += machine.getLocalMakespan()
        });
        output.value = sum
        output.param = randParam

        console.log(output)
    }

    getMakespans = () => {
        let spans = []
        this.machines.forEach(machine => {
            spans.push(machine.getLocalMakespan());
        });
        return spans;
    }

    TakeSnapshot() {
        this.bestSolution = []
        this.machines.forEach(machine => {
            this.bestSolution.push(machine.getTasks())
        });
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
                    this.TakeSnapshot()
                    this.runs++
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
                    this.TakeSnapshot()
                    this.runs++
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

    var end = new Date().getTime();
    var time = end - start;

    manager.plot();

    manager.generateOutput(time, randomParam)
}