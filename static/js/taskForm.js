import {displayMessage, getSelectValues} from "./functions.js";
import GroupApi from "./api/groupApi.js";
export default class TaskForm{
    constructor(){
        this.api = new GroupApi();
        this.name = document.getElementById("name");
        this.description = document.getElementById("description");
        this.status = document.getElementById("status");
        this.deadline = document.getElementById("deadline");
        this.importancy = document.getElementById("importancy");
        this.groupSelect = document.getElementById("groupSelect");
        this.userSelect = document.getElementById("userSelect");
        this.userSelectDiv = document.getElementById("userSelectTextDiv");
        this.form = document.getElementById("addTask");
        this.rangeValue = document.querySelector(".rangeValue");
        this.groupUrl = "http://127.0.0.1:8000/task_api/group_list/";
        this.noGroupValue = "Just You";
        this.currentGroupName = this.noGroupValue;
        this._currentTaskId = -1;
    }
    fillGroupSelect = async () => {
        const groups = await this.api.getCurrentUserGroups();
        groups.forEach(group => {
            this.groupSelect.innerHTML += `<option value="${group.group_name}">
    ${group.group_name}</option>`
        })
    }
    fillUserSelect = async () => {
        this.userSelectDiv.innerText = "";
        this.userSelect.style.display = "block";
        this.userSelect.innerHTML = "";
        const groups = await this.api.read(this.groupUrl)
        const users = await this.api.read("http://127.0.0.1:8000/task_api/app_users_list/")  
        const currentGroup = groups.find(group => 
            group.group_name === this.currentGroupName    
        );
        if(currentGroup === undefined){
            this.userSelectDiv.innerText = "You";
            this.userSelect.style.display = "none";
            return;
        }
        const groupMembers = users.filter(user =>
            currentGroup.members.includes(user.user)  
        );
        groupMembers.forEach(user => {
            this.userSelect.innerHTML += `<option value="${user.user}">
    ${user.username}</option>`
        });
    }
    getTask = (group, chosenUsers) =>{
        return{
            name: this.name.value,
            description: this.description.value,
            deadline: this.deadline.value,
            status: this.status.value,
            importancy: this.importancy.value,
            group: group,
            users:chosenUsers
        }
    }
    fillUserInput = async (task) =>{
        const users = await this.api.read("http://127.0.0.1:8000/task_api/users_list/")
        const matchingUsers = users.filter(user => 
            task.users.includes(user.id))
            .map(user => user.id);
        
        const options = document.querySelectorAll("#userSelect option")
        options.forEach(opt => {
            if(matchingUsers.includes(Number(opt.value)))
                opt.selected = true;
        })
    }
    fillInputFields = async (taskId) =>{
        const task = await this.api.read(`http://127.0.0.1:8000/task_api/task_detail/${taskId}`);
        this.rangeValue.innerText = task.importancy;
        this.name.value = task.name;
        this.description.value = task.description;
        this.deadline.value = new Date(task.deadline).toISOString().slice(0,16);
        this.importancy.value = task.importancy;
        this.status.value = task.status;
        this.currentGroupName = await this.api.getGroupName(task.group);
        this.groupSelect.value = this.currentGroupName;
        await this.fillUserSelect();
        if(this.currentGroupName !== this.noGroupValue)
            await this.fillUserInput(task);
    }
    createTask = async () => {
        let url ="";
        if (this._currentTaskId !== -1){ 
            url=`http://127.0.0.1:8000/task_api/update_task/${this.currentTaskId}`
        }
        else  
            url = "http://127.0.0.1:8000/task_api/create_task/";
    
        let group = null;
        const groups = await this.api.read(this.groupUrl);
        const currentGroup = groups.find(g => g.group_name === this.currentGroupName);
        if (currentGroup !== undefined) {
            group = currentGroup.id;
        }
        const users = await this.api.read("http://127.0.0.1:8000/task_api/app_users_list/");
        const selectValue = getSelectValues(userSelect);
        let chosenUsers = users
        .filter(user => selectValue.includes(user.user.toString()))
        .map(user => user.user);
        
        if(this.currentGroupName === this.noGroupValue)
            chosenUsers = [Number(localStorage.getItem("currentUserId"))];
        
        const task = this.getTask(group, chosenUsers);
        await this.api.createOrUpdate(url, task, "POST")
        displayMessage("You have successfully created a new task");
        this.form.reset();
        window.location.reload();
    }
    get currentTaskId(){
        return this._currentTaskId;
    }
    set currentTaskId(id){
        this._currentTaskId = id;
    }
    init = () =>{
        this.groupSelect.addEventListener("change",async () => {
            this.currentGroupName = this.groupSelect.value;
            await this.fillUserSelect();
        })
        this.form.addEventListener("submit", (f) =>{
            f.preventDefault();
            this.createTask()
            this._currentTaskId = -1;
        })
        this.fillGroupSelect();
        this.fillUserSelect();
    }
}