import Task from './task.js';
import DateManager from './dateManager.js';
export default class TaskManager{
    constructor(){
        this.dm = new DateManager();
    }
    createTaskArray = async () => {
        let taskArr = [];
        const tasks_api = await fetch("http://127.0.0.1:8000/task_api/task_list/")        
        const tasks_json = await tasks_api.json()
        const tasks = await tasks_json;
        const users_api = await fetch("http://127.0.0.1:8000/task_api/users_list/")
        const users_json = await users_api.json()
        const users = await users_json;
        tasks.forEach((task, i) => {
            let userArray = [];
            const userIndexes = task.users;
            const usernames = users.map((user) => {
                for(let id of userIndexes){
                    if(user.id === id)
                        return user.username
                }
            }).join(" ");
            taskArr.push(new Task(
                task.name, task.description, task.status,
                this.dm.stringToDate(task.deadline),
                this.dm.stringToDate(task.date_added),
                task.importancy,
                usernames, i,
                task.id
            ))
        })
        return taskArr;
    }
}