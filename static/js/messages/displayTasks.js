import DateManager from '../calendar/dateManager.js';

const dm = new DateManager();
export const displayTasks = (userId, friendId, allTasks, div) => {
    const tasks = getTasks(userId, friendId, allTasks)
    tasks.forEach(task => {
        let cssClass = Number(task.importancy) > 3 ? (Number(task.importancy) > 6 ? "high" : "medium" ) : "low"
        div.innerHTML += taskDiv(task, cssClass)
    });
}
const getTasks = (userId, friendId, allTasks) => {
    let ids = `${userId} ${friendId}`;
    let idsReversed = `${friendId} ${userId}`
    return allTasks.filter(task => {
        let users = task.users.join(" ");
        if(users.includes(ids) || users.includes(idsReversed))
            return true;
        
        return false;
    })
}
const taskDiv = (task, cssClass) => {
    return `<div class="task ${cssClass}">
    <h4>
        Task: ${task.name}
    </h4>
    <h6>
        Description: ${task.description}
    </h6>
    <p>Deadline: ${dm.formatDatetime(dm.stringToDate(task.deadline))}</p>
    <p>Status: ${task.status}</p>
    <p>Importancy: ${task.importancy}</p>    
</div>`
}