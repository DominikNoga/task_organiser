import DateManager from './dateManager.js'
import TaskManager from './taskManager.js'
import Row from './row.js'

export default class LayoutManager {
    constructor(){
        this.NEXT = 1;
        this.PREV = 0;
        this.tm = new TaskManager()
        const taskDivs = document.getElementsByClassName('task')
        this.tasks = this.tm.createTaskArray(taskDivs.length)
        this.dm = new DateManager()
        this.rows = []
        this.rowDivs = document.getElementsByClassName('row')
        this.dm.dateArr.forEach((date) => {
            this.rows.push(new Row(date, this.tasks))
        })
        this.buttons = document.getElementsByClassName('slider-btn')
        
    }
    updateRows = (value) =>{
        this.dm.updateDates(value)
        this.rows.forEach((row, i) =>{
            row.date = this.dm.dateArr[i];
            row.setTasks(this.tasks)
            row.clearRow(this.rowDivs[i]);
            row.fillRow(this.rowDivs[i]);
        })
        this.dm.updateDateSlider()
    }
    init = () =>{
        this.buttons[this.PREV].addEventListener("click", () =>{
            this.updateRows(-1)
        });

        this.buttons[this.NEXT].addEventListener("click", () =>{
            this.updateRows(1);
        });
        this.dm.updateDateSlider();
    }
    buildLayout = () => {
        this.init();
        this.rows.forEach((row, i) => {
            row.fillRow(this.rowDivs[i])
        })
    }
}   