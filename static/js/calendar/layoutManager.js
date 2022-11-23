import DateManager from './dateManager.js'
import TaskManager from './taskManager.js'
import Row from './row.js'
import GroupApi from '../api/groupApi.js';
import TaskApi from '../api/taskApi.js';
import GroupManager from '../home/groups.js';
import TaskForm from './taskForm.js';
import { displayAcceptMessage, waitForPopup } from '../functions.js';
export default class LayoutManager {
    constructor(){
        this.NEXT = 1;
        this.PREV = 0;
        this.tm = new TaskManager();
        this.tasks = []
        this.dm = new DateManager()
        this.rows = []
        this.groupApi = new GroupApi();
        this.taskApi = new TaskApi();
        this.rowDivs = document.querySelectorAll('.row')
        this.buttons = document.getElementsByClassName('slider-btn');
        this.datePicker = document.querySelector('#datePicker');
        this.gm = new GroupManager();
        this.addTaskBtn = document.querySelector("#addTaskBtn");
        this.formContainer = document.querySelector("#taskFormContainer");
        this.taskForm = new TaskForm();
    }
    handleRowAnimation = (value) =>{
        if(value === 0)
            return;
        let className = "row-forwards", classNameToRemove = "row-backwards";
        if(value > 0){    
            className = "row-backwards" 
            classNameToRemove = "row-forwards"
        }
        this.rowDivs.forEach(rowDiv => {
            rowDiv.classList.remove(className);
            rowDiv.classList.remove(classNameToRemove);
            setTimeout(() => {
                rowDiv.classList.add(className);
            },200)
        })
    }
    updateRows = (value) =>{
        this.handleRowAnimation(value);
        setTimeout(() => {
            this.dm.updateDates(value)
            this.rows.forEach((row, i) =>{
                row.date = this.dm.dateArr[i];
                row.setTasks(this.tasks)
                row.clearRow(this.rowDivs[i]);
                row.fillRow(this.rowDivs[i]);
            })
            this.dm.updateDateSlider();
            this.updateButtons();
        }, 1200)
    }
    hideFormListener = () =>{
        this.hideFromBtn = document.querySelector(".hideFormBtn");
        this.hideFromBtn.addEventListener("click", () =>{
            this.handleFormAnimation("form-hidden", "form-active");
            setTimeout(() =>{
                this.formContainer.style.display = "none";
            },800)
        });
    }
    displayTaskForm = () => {        
        this.formContainer.style.display = "block";
        this.hideFormListener();
        this.handleFormAnimation("form-active", "form-hidden");
        this.taskForm.form.reset();
        const rangeInput = document.querySelector("input[type='range']");
        rangeInput.value = 1;
        this.taskForm.rangeValue.innerText = 1;
    }
    init = () =>{
        this.taskForm.init();
        this.addTaskBtn.addEventListener("click", () =>{
            this.displayTaskForm() 
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
            const dateDifferance = this.dm.calcDateDifferance(
                datePickerValue, this.dm.dateArr[1]
            );
            this.updateRows(dateDifferance);
        });
        this.dm.updateDateSlider();
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
                displayAcceptMessage("Are you sure you want to delete this task?", "Yes", "No");
                const subBtn = document.querySelector("#popupSubmit");
                const cancelBtn = document.querySelector("#popupCancel");
                let id = Number(btn.id.slice(8));
                try{
                    await waitForPopup(subBtn, cancelBtn);
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
                this.handleFormAnimation("form-active", "form-hidden");
                this.hideFormListener();
                this.taskForm.currentTaskId = id;
                this.taskForm.fillInputFields(id);
            });
        }
    }
    deleteTask = async (id) =>{
        const task = this.tasks.find(t => t.db_id === id);
        for(let t of this.tasks){
            if(t.db_id === id){
                t.toBeDeleted = true;
                break;
            }
        }
        this.tasks.sort((t1, t2) => Number(t1.toBeDeleted) - Number(t2.toBeDeleted));
        this.tasks.pop();
        await this.taskApi.delete(task.db_id);
    }
    handleFormAnimation = (className, classToRemove) =>{
        this.taskForm.wrapper.classList.add(className);
        this.taskForm.wrapper.classList.remove(classToRemove);
    }
}   