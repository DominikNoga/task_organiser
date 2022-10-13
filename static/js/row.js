import DateManager from './dateManager.js'
export default class Row{
    constructor(date, tasks, index){
        this.dm = new DateManager();
        this.date = this.dm.cutTime(date);
        this.tasks = tasks.filter((task)=>{
            return  Number(this.dm.cutTime(task.deadline)) === Number(this.date);
        });
        this.index = index;
    }
    fillRow = (div) =>{
        this.tasks.forEach((task)=>{
            div.innerHTML += task.createDiv();
        });
    }
    clearRow = (div) =>{
        div.innerHTML = '<div class="date-link"></div>';
    }
    setTasks = (tasks) =>{
        this.tasks = tasks.filter((task)=>{
            return Number(this.dm.cutTime(task.deadline)) === Number(this.dm.cutTime(this.date));
        });
    }
    removeTask = (div, id) => {
        const children = div.childNodes;     
        for(let child of children) {
            if(child.nodeName === "DIV") {
                if(child.id !== undefined){
                    if(child.id.slice(4) === id.toString()) {
                        div.removeChild(child);
                    }
                }
            }
        }
    }
}