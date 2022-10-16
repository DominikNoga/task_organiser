import DateManager from './dateManager.js'
import TaskManager from './taskManager.js'
import Row from './row.js'

export default class LayoutManager {
    constructor(){
        this.NEXT = 1;
        this.PREV = 0;
        this.tm = new TaskManager();
        this.tasks = []
        this.dm = new DateManager()
        this.rows = []
        this.rowDivs = document.getElementsByClassName('row')
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
        this.csrftoken = this.getCookie('csrftoken')
        this.buttons[this.PREV].addEventListener("click", () =>{
            this.updateRows(-1)
        });
        this.buttons[this.NEXT].addEventListener("click", () =>{
            this.updateRows(1)
        });
        this.dm.updateDateSlider();
    }
    buildLayout = async () => {
        this.init();
        this.tasks = await this.tm.createTaskArray();
        this.dm.dateArr.forEach((date, i) => {
            this.rows.push(new Row(date, this.tasks, i))
        })
        this.rows.forEach((row, i) => {
            row.fillRow(this.rowDivs[i])
        })
        this.updateButtons();

    }
    updateButtons = () =>{
        this.taskBtns = document.getElementsByClassName('btn-task'); 
        for(let btn of this.taskBtns){
            btn.addEventListener('click', async () => {
                let id = Number(btn.id.slice(8));
                this.popup.style.display = 'block';
                try{
                    await this.waitForPopup();
                    await this.deleteTask(id);
                }catch(e){
                }
                this.updateRows(0);
            });
        }
    }
    waitForPopup = () =>{
        return new Promise((resolve, reject) =>{        

            this.subBtn.addEventListener('click', () =>{
                this.popup.style.display = 'none';
                resolve();
            })
            this.cancelBtn.addEventListener('click', () =>{
                this.popup.style.display = 'none';
                reject();
            })
        })
    }
    deleteTask = async (id) =>{
        const task = this.tasks.find(t => t.id === id);
        id = Number(task.db_id)
        const url = `http://127.0.0.1:8000/task_api/task_delete/${id}`
        const options = {
            method: "DELETE",
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':this.csrftoken,
            },
        }
        for(let t of this.tasks){
            if(t.id === id){
                t.toBeDeleted = true;
                break;
            }
        }
        this.tasks.sort((t1, t2) => Number(t1.toBeDeleted) - Number(t2.toBeDeleted));
        this.tasks.pop();
        await fetch(url, options)
    }
    getCookie = (name) => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
}   