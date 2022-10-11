import DateManager from './dateManager.js'
export default class Task{
    constructor(name, description, status,
        deadline, date, importancy, users){
        this.deadline = deadline;
        this.dm = new DateManager();
        this.importancy = importancy;
        this.name = name;
        this.date_start = date;
        this.status = status;
        this.description = description;
        this.users = users;
        this.class = this.importancy > 3 ? (this.importancy > 6 ? "high" : "medium" ) : "low"
    }

    createDiv = () =>{
        return `<div class="task2 ${this.class}">
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