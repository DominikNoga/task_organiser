import DateManager from './dateManager.js'
import TaskManager from './taskManager.js'
import Row from './row.js'

export default class LayoutManager {
    constructor(){
        this.NEXT = 1;
        this.PREV = 0;
        this.tm = new TaskManager()
        this.tasks = this.tm.createTaskArray()
        this.dm = new DateManager()
        this.rows = []
        this.rowDivs = document.getElementsByClassName('row')
        this.dm.dateArr.forEach((date, i) => {
            this.rows.push(new Row(date, this.tasks, i))
        })
        this.buttons = document.getElementsByClassName('slider-btn');
        this.popup = document.getElementsByClassName('popupMessage')[0];
        this.subBtn = document.getElementById("popupSubmit")
        this.cancelBtn = document.getElementById("popupCancel")
        this.deleteLink = document.querySelector('.popupMessage a');
    }
    updateRows = (value) =>{
        this.dm.updateDates(value)
        this.rows.forEach((row, i) =>{
            row.date = this.dm.dateArr[i];
            row.setTasks(this.tasks)
            row.clearRow(this.rowDivs[i]);
            row.fillRow(this.rowDivs[i]);
        })
        this.dm.updateDateSlider();
        this.updateButtons();
    }
    init = () =>{
        this.buttons[this.PREV].addEventListener("click", () =>{
            this.updateRows(-1)
        });
        this.buttons[this.NEXT].addEventListener("click", () =>{
            this.updateRows(1)
        });
        this.dm.updateDateSlider();
    }
    buildLayout = () => {
        this.init();
        this.rows.forEach((row, i) => {
            row.fillRow(this.rowDivs[i])
        })
        this.updateButtons();

    }
    deleteTask = (id) => {
        return new Promise((resolve) =>{
            const task = this.tasks.find(t => t.id === id);
            id = Number(task.db_id)
            window.location.href = "\\home";
        })
    }
    updateButtons = () =>{
        this.taskBtns = document.getElementsByClassName('btn-task'); 
        for(let btn of this.taskBtns){
            btn.addEventListener('click', () => {
                let id = Number(btn.id.slice(8));
                this.popup.style.display = 'block';
                this.waitForPopup(id);
               
            });
        }
    }
    waitForPopup = (id) =>{
        const task = this.tasks.find(t => t.id === id);
        id = Number(task.db_id)
        this.deleteLink.href = `\\delete_task\\${id}`;
        this.subBtn.addEventListener('click', () =>{
            this.popup.style.display = 'none';
        })
        this.cancelBtn.addEventListener('click', () =>{
            this.popup.style.display = 'none';
        })
    }
}   