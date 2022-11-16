import {displayMessage, getSelectValues} from "../functions.js";
import GroupApi from "../api/groupApi.js";
import AppUserApi from "../api/appUserApi.js";
import TaskApi from "../api/taskApi.js";
export default class TaskForm{
    constructor(){
        this.groupApi = new GroupApi();
        this.userApi = new AppUserApi();
        this.taskApi = new TaskApi();
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
        this.noGroupValue = "Just You";
        this.currentGroupName = this.noGroupValue;
        this._currentTaskId = -1;
        this.wrapper = document.querySelector("#taskFormWrapper");
    }
    fillGroupSelect = async () => {
        const currentUserId = Number(localStorage.getItem("currentUserId"));
        const groups = await this.groupApi.getUserGroups(currentUserId);
        groups.forEach(group => {
            this.groupSelect.innerHTML += `<option value="${group.group_name}">
    ${group.group_name}</option>`
        })
    }
    fillUserSelect = async () => {
        this.userSelectDiv.innerText = "";
        this.userSelect.style.display = "block";
        this.userSelect.innerHTML = "";
        const groups = await this.groupApi.read();
        const users = await this.userApi.read();
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
        const users = await this.userApi.read();
        const matchingUsers = users.filter(user => 
            task.users.includes(user.user))
            .map(user => user.user);
        
        const options = document.querySelectorAll("#userSelect option")
        options.forEach(opt => {
            if(matchingUsers.includes(Number(opt.value)))
                opt.selected = true;
        })
    }
    fillInputFields = async (taskId) =>{
        const task = await this.taskApi.readDetail(taskId);
        this.rangeValue.innerText = task.importancy;
        this.name.value = task.name;
        this.description.value = task.description;
        this.deadline.value = new Date(task.deadline).toISOString().slice(0,16);
        this.importancy.value = task.importancy;
        this.status.value = task.status;
        this.currentGroupName = await this.groupApi.getGroupName(task.group);
        this.groupSelect.value = this.currentGroupName;
        await this.fillUserSelect();
        if(this.currentGroupName !== this.noGroupValue)
            await this.fillUserInput(task);
    }
    createTask = async () => {
        let group = null;
        const groups = await this.groupApi.read();
        const currentGroup = groups.find(g => g.group_name === this.currentGroupName);
        if (currentGroup !== undefined) {
            group = currentGroup.id;
        }
        const users = await this.userApi.read();
        const selectValue = getSelectValues(userSelect);
        let chosenUsers = users
        .filter(user => selectValue.includes(user.user.toString()))
        .map(user => user.user);
        
        if(this.currentGroupName === this.noGroupValue)
            chosenUsers = [Number(localStorage.getItem("currentUserId"))];
        
        const task = this.getTask(group, chosenUsers);
        
        if(this.currentTaskId !== -1)
            await this.taskApi.update(task, this.currentTaskId);
        else
            await this.taskApi.create(task);
        
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