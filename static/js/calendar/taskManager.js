import Task from './task.js';
import DateManager from './dateManager.js';
import {fetchApi} from '../functions.js';
export default class TaskManager{
    constructor(){
        this.dm = new DateManager();
    }
    createTaskArray = async () => {
        let taskArr = [];
        const tasks = await fetchApi("http://127.0.0.1:8000/task_api/task_list/");
        const users = await fetchApi("http://127.0.0.1:8000/task_api/users_list/");
        const groups = await fetchApi("http://127.0.0.1:8000/task_api/group_list/");
        tasks.forEach((task, i) => {
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
                usernames, i,
                task.id,
                groupName
            ))
        })
        return taskArr;
    }
}