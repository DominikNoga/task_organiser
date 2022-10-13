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
        this.deleteFlag = -1;
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
        this.cancelBtn.addEventListener("click", () =>{
            this.deleteFlag = 0;
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
        console.log("delete task on")
        return new Promise((resolve) => {
            if(this.deleteFlag ===1){
                let toDelete;
                this.tasks.forEach((task) => {
                    if (task.id === id) {
                        toDelete = task;
                        task.toBeDeleted = true;
                    }
                })
                this.tasks.sort((a, b) => Number(a.toBeDeleted) - Number(b.toBeDeleted));
                this.tasks.pop();
                const row = this.rows.filter(row => {
                    return Number(this.dm.cutTime(toDelete.deadline)) === Number(this.dm.cutTime(row.date))
                })[0];
                row.removeTask(this.rowDivs[row.index], id);
                resolve();
            }
        });
    }
    updateButtons = () =>{
        this.taskBtns = document.getElementsByClassName('btn-task'); 
        for(let btn of this.taskBtns){
            btn.addEventListener('click', async () => {
                let id = Number(btn.id.slice(8));
                this.popup.style.display = 'block';
                try{
                    await this.waitForPopup();
                    await this.deleteTask(id)
                }
                catch(e){
                    console.log(e);
                }
            });
        }
    }
    waitForPopup = () =>{
        return new Promise((resolve, reject) =>{
            this.subBtn.addEventListener('click', () =>{
                this.popup.style.display = 'none';
                this.deleteFlag = 1;
                resolve();
            })
            this.cancelBtn.addEventListener('click', () =>{
                this.popup.style.display = 'none';
                this.deleteFlag = 0;
                reject("task not deleted");
            })
        });
    }
}   