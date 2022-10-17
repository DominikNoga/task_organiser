import { sendFriendRequest } from "./sendFriendRequest.js";

const input = document.querySelectorAll(".addFriendForm input")[0];
const users_list = document.querySelector(".users_list");
const form = document.querySelector(".addFriendForm");
const addBtn = document.querySelector(".addFriendForm button");
const fillUsersList = async (text) => {
    let current_index = null;
    const url = "http://127.0.0.1:8000/task_api/users_list/"
    const users_api = await fetch(url)
    const users_json = await users_api.json()
    const users = await users_json
    let matching_users = users.filter(user => user.username.includes(text))
    users_list.innerHTML = '';
    for (let user of matching_users) {
        let html = `<div id=user_${user.id}> ${user.username} </div>`
        users_list.innerHTML += html;
    }
    const userDivs = document.querySelectorAll(".users_list div")
    userDivs.forEach((div) => {
        div.addEventListener("click", () =>{
            current_index = Number(div.id.slice(5));
            input.value = matching_users
            .find(user => user.id === current_index).username
        })
    })
    addBtn.addEventListener("click", async () =>{
        await sendFriendRequest();
    });

};
form.addEventListener('submit',(e) =>{
    e.preventDefault();
})
input.addEventListener("input", async () => {
    let text = input.value;
    if(text.length > 0) 
        await fillUsersList(text);
    else
        users_list.innerHTML ='';
});
