import {fetchApi} from "./functions.js";
import {csrftoken as token} from "./messages/token.js";
const name = document.getElementById("name");
const description = document.getElementById("description");
const status = document.getElementById("status");
const deadline = document.getElementById("deadline");
const importancy = document.getElementById("importancy");
const groupSelect = document.getElementById("groupSelect");
const userSelect = document.getElementById("userSelect");
const userSelectDiv = document.getElementById("userSelectDiv");
const form = document.getElementById("addTask");
const groupUrl = "http://127.0.0.1:8000/task_api/group_list/"
const currentUserIndex = 1;
let currentGroupName = "just You";
const currentUrl = document.URL;
const getSelectValues = (select) => {
    const result = [];
    const options = select && select.options;
    let opt;
  
    for (let i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }
const fillGroupSelect = async () => {
    const groups = await fetchApi("http://127.0.0.1:8000/task_api/group_list/")
    const currentUserGroups = groups.filter(group => 
        group.members.includes(currentUserIndex)
    );
    currentUserGroups.forEach(group => {
        groupSelect.innerHTML += `<option value="${group.group_name}">
${group.group_name}</option>`
    });
};
const fillUserSelect = async () => {
    userSelect.innerHTML = "";
    const groups = await fetchApi(groupUrl)
    const users = await fetchApi("http://127.0.0.1:8000/task_api/app_users_list/")  
    const currentGroup = groups.find(group => 
        group.group_name === currentGroupName    
    );
    if(currentGroup === undefined){
        return;
    }
    const groupMembers = users.filter(user =>
        currentGroup.members.includes(user.user)  
    );
    groupMembers.forEach(user => {
        userSelect.innerHTML += `<option value="${user.user}">
${user.username}</option>`
    });
}
const getTask = (group, chosenUsers) =>{
    const task = {
        name: name.value,
        description: description.value,
        deadline: deadline.value,
        status: status.value,
        importancy: importancy.value,
        group: group,
        users:chosenUsers
    }
}
const fillInputFields = () =>{
    const task = fetchApi(`http://127.0.0.1:8000/task_api/task_detail/1`);
    name.value = task.name;
    description.value = task.description;
    deadline.value = task.deadline;
    importancy.value = task.importancy;
}
const createTask = async () => {
    const currentTaskId = 1;
    let url ="";
    currentUrl.includes("edit") ?  url=`http://127.0.0.1:8000/task_api/update_task/${currentTaskId}`:
        url = "http://127.0.0.1:8000/task_api/create_task/";

    let group = null;
    const groups = await fetchApi(groupUrl);
    const currentGroup = groups.find(g => g.group_name === currentGroupName);
    if (currentGroup !== undefined) {
        group = currentGroup.id;
    }
    const users = await fetchApi("http://127.0.0.1:8000/task_api/app_users_list/");
    const selectValue = getSelectValues(userSelect);
    const chosenUsers = users.filter(user => selectValue.includes(user.user.toString())).map(user => user.user);
    const task = getTask(group, chosenUsers);
    const options = {
        method: "POST",
        headers: {
            'Content-type':"application/json",
            'X-CSRFToken': token
        },
        body: JSON.stringify(task)
    }
    const create_task = fetch(url, options);
}
groupSelect.addEventListener("change",async () => {
    currentGroupName = groupSelect.value;
    await fillUserSelect();
})

fillGroupSelect();
form.addEventListener("submit", async (f) =>{
    f.preventDefault();
    await createTask()
})

if (currentUrl.includes("edit")) 
    fillInputFields()