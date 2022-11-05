import Task from './task.js';
import DateManager from './dateManager.js';
import Api from '../api/api.js';
import GroupApi from '../api/groupApi.js';
import AppUserApi from '../api/appUserApi.js';
import GroupManager from '../home/groups.js';
import TaskApi from '../api/taskApi.js';
export default class TaskManager{
    constructor(){
        this.dm = new DateManager();
        this.gm = new GroupManager();
        this.groupApi = new GroupApi();
        this.taskApi = new TaskApi();
        this.userApi = new AppUserApi();
    }
    createTaskArray = async () => {
        let taskArr = [];
        const currenUserId = Number(localStorage.getItem("currentUserId"));
        const userTasks = await this.taskApi.getUserTasks(currenUserId);
        const users = await this.userApi.read();
        const groups = await this.groupApi.read();
        userTasks.forEach((task, i) => {
            const userIndexes = task.users;
            const usernames = users.map((user) => {
                for(let id of userIndexes){
                    if(user.user === id)
                        return user.username
                }
            }).join(" ");
            let groupName = "Just You";
            if(task.group !== null){
                groupName = groups.find(group => group.id === task.group).group_name;
            }
            taskArr.push(new Task(
                task.name, task.description, task.status,
                this.dm.stringToDate(task.deadline),
                this.dm.stringToDate(task.date_added),
                task.importancy,
                usernames,
                task.id,
                groupName
            ))
            
        })
        return taskArr;
    }
}