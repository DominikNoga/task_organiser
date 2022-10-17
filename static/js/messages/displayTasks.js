import DateManager from '../calendar/dateManager.js';

const dm = new DateManager();
export const displayTasks = async (userId, friendId, allTasks, div) => {
    const tasks = await getTasks(userId, friendId, allTasks)
    console.log(tasks)
    tasks.forEach(task => {
        div.innerHTML += taskDiv(task)
    });
}
const getTasks = async (userId, friendId, allTasks) => {
    let ids = `${userId} ${friendId}`;
    let idsReversed = `${friendId} ${userId}`
    let tasks = await allTasks.filter(task => {
        let users = task.users.join(" ");
        if(users.includes(ids)
            || users.includes(idsReversed)
        )
            return true;
        
        return false;
    })
    return tasks;

}
const taskDiv = (task) => {
    return `<div class="task low">
    <a href="\\edit_task\\${task.id}" class="editTaskLink" title="edit task"><i class="fa fa-edit"></i></a>
    <button class="btn-task" id="btn-task${task.id}" title="delete task"><i class="fa fa-trash"></i></button>
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