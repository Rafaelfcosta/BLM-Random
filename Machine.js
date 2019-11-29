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

    getTask(index) {
        return this.tasks[index];
    }

    getLocalMakespan() {
        return this.tasks.reduce((a, b) => a + b, 0)
    }

    pushTask(task) {
        this.tasks.push(task);
    }

    popTask() {
        return this.tasks.pop();
    }

    popRandomTask(){
        let i = Math.floor(Math.random() * this.tasks.length)
        let temp = this.tasks[i];
        this.tasks.splice(i, 1);
        return temp
    }

    popExpensiveTaskIndex() {
        let index = this.tasks.indexOf(Math.max(...this.tasks));
        let temp = this.tasks[index];
        this.tasks.splice(index, 1);
        return temp;
    }
}