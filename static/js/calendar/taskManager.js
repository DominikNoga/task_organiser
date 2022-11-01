import Task from './task.js';
import DateManager from './dateManager.js';
import Api from '../api/api.js';
import GroupManager from '../home/groups.js';
import TaskApi from '../api/taskApi.js';
export default class TaskManager{
    constructor(){
        this.dm = new DateManager();
        this.gm = new GroupManager();
        this.api = new Api();
        this.taskApi = new TaskApi();
    }
    createTaskArray = async () => {
        let taskArr = [];
        const currenUserId = Number(localStorage.getItem("currentUserId"));
        const userTasks = await this.taskApi.getUserTasks(currenUserId);
        const users = await this.api.read("http://127.0.0.1:8000/task_api/users_list/");
        const groups = await this.api.read("http://127.0.0.1:8000/task_api/group_list/");
        userTasks.forEach((task, i) => {
            const userIndexes = task.users;
            const usernames = users.map((user) => {
                for(let id of userIndexes){
                    if(user.id === id)
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