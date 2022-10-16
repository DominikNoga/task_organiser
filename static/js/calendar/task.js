import DateManager from './dateManager.js'
export default class Task{
    constructor(name, description, status,
        deadline, date, importancy, users, id, db_id){
        this.deadline = deadline;
        this.dm = new DateManager();
        this.importancy = importancy;
        this.name = name;
        this.date_start = date;
        this.status = status;
        this.description = description;
        this.users = users;
        this.class = this.importancy > 3 ? (this.importancy > 6 ? "high" : "medium" ) : "low"
        this.toBeDeleted = false;
        this.id = id;
        this.db_id  = Number(db_id);
    }

    createDiv = () =>{
        return `<div class="task ${this.class}" id="task${this.id}">
    <a href="\\edit_task\\${this.db_id}" class="editTaskLink" title="edit task"><i class="fa fa-edit"></i></a>
    <button class="btn-task" id="btn-task${this.id}" title="delete task"><i class="fa fa-trash"></i></button>
    <h4>
        Task: ${this.name}
    </h4>
    <h6>
        Description: ${this.description}
    </h6>
    <p>Deadline: ${this.dm.formatDatetime(this.deadline)}</p>
    <p>Status: ${this.status}</p>
    <p>Importancy: ${this.importancy}</p>
    <p>Users: ${this.users}</p>
    
</div>`
    }

}