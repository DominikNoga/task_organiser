import Api from "./api.js";
export default class TaskApi extends Api{
    constructor() {
        super();
        this.taskListUrl = "http://127.0.0.1:8000/task_api/task_list/";
    }
    getUserTasks = async (userId) =>{
        const tasks = await this.read(this.taskListUrl);
        return tasks.filter(task => task.users.includes(userId));
    }
}