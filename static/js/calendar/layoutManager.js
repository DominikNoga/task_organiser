import DateManager from './dateManager.js'
import TaskManager from './taskManager.js'
import Row from './row.js'
import GroupApi from '../api/groupApi.js';
import GroupManager from '../home/groups.js';
import TaskForm from '../taskForm.js';
export default class LayoutManager {
    constructor(){
        this.NEXT = 1;
        this.PREV = 0;
        this.tm = new TaskManager();
        this.tasks = []
        this.dm = new DateManager()
        this.rows = []
        this.api = new GroupApi();
        this.rowDivs = document.getElementsByClassName('row')
        this.buttons = document.getElementsByClassName('slider-btn');
        this.popup = document.getElementsByClassName('popupMessage')[0];
        this.subBtn = document.getElementById("popupSubmit")
        this.cancelBtn = document.getElementById("popupCancel")
        this.deleteLink = document.querySelector('.popupMessage a');
        this.datePicker = document.querySelector('#datePicker');
        this.groupSelect = document.querySelector('#groupSelectCalendar');
        this.gm = new GroupManager();
        this.addTaskBtn = document.querySelector("#addTaskBtn");
        this.formContainer = document.querySelector("#taskFormContainer");
        this.taskForm = new TaskForm();
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
    hideFormListener = () =>{
        this.hideFromBtn = document.querySelector(".hideFormBtn");
        this.hideFromBtn.addEventListener("click", () =>{
            this.formContainer.style.display = "none";
        });
    }
    init = () =>{
        this.taskForm.init();
        this.fillGroupSelect();
        this.addTaskBtn.addEventListener("click", () =>{
            this.formContainer.style.display = "block";
            this.hideFormListener();
            this.taskForm.form.reset();
            this.taskForm.rangeValue.value = 1;
        })
        this.buttons[this.PREV].addEventListener("click", () =>{
            this.updateRows(-1)
        });
        this.buttons[this.NEXT].addEventListener("click", () =>{
            this.updateRows(1)
        });
        this.datePicker.addEventListener('change', () =>{
            const datePickerValue = this.dm.
            createDateFromString(this.datePicker.value)
            this.updateRows(
                this.dm.calcDateDifferance(
                    datePickerValue, this.dm.dateArr[1]
                )
            );
        });
        this.groupSelect.addEventListener("change", async () => {
            this.buildLayout(this.groupSelect.value);
        })
        this.dm.updateDateSlider();
    }
    fillGroupSelect = async () => {
        const groups = await this.api.getCurrentUserGroups();
        groups.forEach(group => {
            this.groupSelect.innerHTML += `<option value="${group.group_name}">
    ${group.group_name}</option>`
        });
        
    }
    buildLayout = async (groupName) => {
        this.init();
        this.tasks = await this.tm.createTaskArray(groupName);
        this.dm.dateArr.forEach((date, i) => {
            this.rows.push(new Row(date, this.tasks, i))
        })
        this.rows.forEach((row, i) => {
            row.fillRow(this.rowDivs[i])
        })
        this.updateButtons();
    }
    updateButtons = () =>{
        const taskBtns = document.getElementsByClassName('btn-task'); 
        const editBtns = document.getElementsByClassName('btn-edit'); 
        this.addDeleteListener(taskBtns);
        this.addEditListener(editBtns);
    }
    addDeleteListener = (taskBtns) =>{
        for(let btn of taskBtns){
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
    addEditListener = (editBtns) =>{
        for(let btn of editBtns){
            btn.addEventListener('click', async () => {
                let id = Number(btn.id.slice(8));
                this.formContainer.style.display = "block";
                this.hideFormListener();
                this.taskForm.currentTaskId = id;
                this.taskForm.fillInputFields(id);
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
        const task = this.tasks.find(t => t.db_id === id);
        const url = `http://127.0.0.1:8000/task_api/task_delete/${task.db_id}`;      
        for(let t of this.tasks){
            if(t.db_id === id){
                t.toBeDeleted = true;
                break;
            }
        }
        this.tasks.sort((t1, t2) => Number(t1.toBeDeleted) - Number(t2.toBeDeleted));
        this.tasks.pop();
        await this.api.delete(url);
    }
}   