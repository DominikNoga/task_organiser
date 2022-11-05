import Api from "./api.js";
export default class TaskApi extends Api{
    constructor() {
        super();
        this.taskListUrl = "http://127.0.0.1:8000/task_api/task_list/";
        this.createUrl = "http://127.0.0.1:8000/task_api/create_task/";
        this.deatilUrl = `http://127.0.0.1:8000/task_api/task_detail/`;
    }
    async readDetail(id){
        return super.read(this.deatilUrl + id);
    }
    async read(){
        return super.read(this.taskListUrl);
    }
    async create(task){
        await super.createOrUpdate(this.createUrl, task, "POST");
    }
    async update(task, id){
        const updateUrl = `http://127.0.0.1:8000/task_api/update_task/${id}`
        await super.createOrUpdate(updateUrl, task, "POST");
    }
    getUserTasks = async (userId) =>{
        const tasks = await this.read(this.taskListUrl);
        return tasks.filter(task => task.users.includes(userId));
    }
    async delete(id){
        const url = `http://127.0.0.1:8000/task_api/task_delete/${id}`;      
        super.delete(url);
    }
}