import {displayMessage} from '../functions.js';
import GroupManager from "./groups.js";
import Api from '../api/api.js';
import MessageApi from '../api/messageApi.js';
import AppUserApi from '../api/appUserApi.js';
const api = new Api();
const userApi = new AppUserApi();
const messageApi = new MessageApi();
const input = document.querySelectorAll(".addFriendForm input")[0];
const users_list = document.querySelector(".users_list");
const addBtn = document.querySelector(".addFriendForm button");
const currentUserId = Number(document.querySelector("#idHome").textContent);
localStorage.setItem("currentUserId", currentUserId);
let current_index = null;
let username = "";
const gm = new GroupManager();
const getNotFriends = async () =>{
    let users = await userApi.read()
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
const addFriend = async () => {
    if(current_index == null || current_index == undefined){
        displayMessage("there is no such user")
        return;
    }
    let txt = `You have successfully sent a friend request!`;
    const messageContent = messageApi.createFriendRequestMessage(username, currentUserId)
    await messageApi.sendMessage(currentUserId, current_index, messageContent, "fr");
    displayMessage(txt);
    users_list.innerHTML = '';
    input.value = '';
}
input.addEventListener("input", async () => {
    let text = input.value;
    if(text.length > 0) 
        await fillUsersList(text);
    else
        users_list.innerHTML ='';
});

addBtn.addEventListener("click", async () =>{
    try{
        await addFriend();
    }catch(e){
        alert(e);
    }
});
const initGm = async () =>{
    await gm.displayGroupTiles();
    gm.initAll();
}
initGm();