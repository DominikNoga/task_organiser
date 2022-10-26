import { sendFriendRequest } from "./sendFriendRequest.js";
import {fetchApi} from '../functions.js';

const input = document.querySelectorAll(".addFriendForm input")[0];
const users_list = document.querySelector(".users_list");
const form = document.querySelector(".addFriendForm");
const addBtn = document.querySelector(".addFriendForm button");
const currentUserId = Number(document.querySelector("#idHome").textContent);
let current_index = null;
let friendId = -1;
let username = "";
const getNotFriends = async () =>{
    const app_users_url = "http://127.0.0.1:8000/task_api/app_users_list/";
    let users = await fetchApi(app_users_url)
    const currentUser = users.find(user => user.user === currentUserId);
    const friends = currentUser.friends;
    return users.filter(user => {
        return (!friends.includes(user.user) && user.user !== currentUserId);
    });

}
const fillUsersList = async (text) => {
    const users = await getNotFriends();
    let matching_users = users.filter(user => user.username.includes(text))
    users_list.innerHTML = '';
    for (let user of matching_users) {
        let html = `<div id=user${user.user}> ${user.username} </div>`
        users_list.innerHTML += html;
    }
    const userDivs = document.querySelectorAll(".users_list div")
    userDivs.forEach((div) => {
        div.addEventListener("click", () =>{
            const id = div.id;
            current_index = Number(id[id.length - 1]);
            username =  matching_users.find(user => user.user === current_index).username
            input.value = username;
        })
    })
};
input.addEventListener("input", async () => {
    let text = input.value;
    if(text.length > 0) 
        await fillUsersList(text);
    else
        users_list.innerHTML ='';
});

addBtn.addEventListener("click", async () =>{
    try{
        if(current_index === null)
            return;
        let txt = `You have successfully sent a friend request!`;
        if(localStorage.getItem(`requestSent${current_index}`)==="sent"){
            txt = "You have already sent a friend request to this user"
            displayMessage(txt);
            return;
        }
        await sendFriendRequest(currentUserId, current_index, username);
        displayMessage(txt);
        users_list.innerHTML = '';
        input.value = '';
        localStorage.setItem(`requestSent${current_index}`, "sent")
    }catch(e){
        console.log(e);
    }
});

const displayMessage = (text) => {
    const main = document.querySelector(".mainContainer");
    const div  = document.createElement("div");
    div.classList.add("popupMessage");
    div.innerHTML = text;
    div.style.display = "block";
    main.appendChild(div);
    setTimeout(()=>{
        main.removeChild(div);
    }, 3000);
};
localStorage.clear();