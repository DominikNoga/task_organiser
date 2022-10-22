import Conversation from "./conversation.js";
import { sendMessage } from "./sendMessage.js";
import { csrftoken as token } from "./token.js";
import { displayTasks } from "./displayTasks.js";
import {fetchApi } from "../functions.js";
const currentUserId = Number(
    document.getElementById("currentId").innerHTML);
const sideConversations = document.getElementsByClassName('sideConversations')[0];
const sendBtn = document.getElementsByClassName('btn-submit')[0];
const messageInput= document.getElementsByClassName('messageInput')[0];
const commonTasks = document.getElementsByClassName('commonTasks')[0];
const urlUsers = "http://127.0.0.1:8000/task_api/app_users_list/";
const urlMessages = "http://127.0.0.1:8000/task_api/messages_list/";
const urlTasks = "http://127.0.0.1:8000/task_api/task_list/";
let currentFriendId = null;


const getCurrentFriendId = async () => {
    const messages = await fetchApi(urlMessages);
    const userMessages = messages.filter(message => 
        (message.reciever === currentUserId || 
            message.sender === currentUserId) 
    
    );
    const lastMessage = userMessages[userMessages.length - 1];
    return (lastMessage.reciever === currentUserId ? 
        lastMessage.sender : lastMessage.reciever)
}

const createUsersArray = async (messages) => {
    const idsSet = new Set();
    messages.forEach((message) => {
        let id = (message.sender === currentUserId ? 
            message.reciever : message.sender);
        idsSet.add(id);
    })
    let users = await fetchApi(urlUsers);
    users = users.filter(user => {
        for(let id of idsSet){
            if(user.user === id)
                return true;
        }
        return false;
    })
    return users;
}
const ConversationTile = (user, messages) =>{
    return `<div class="conversationTile">
    <img src="static/img${user.profile_pic}" alt="" class="profileImg">
    <div>
        ${user.username}
        <br/>
        <small>${messages[messages.length-1].content}</small>
    </div>
</div>`
}

const displayMessages = async ()=>{
    const messages = await fetchApi(urlMessages);
    const userMessages = messages.filter(message => 
        (message.reciever === currentUserId || 
            message.sender === currentUserId) 
    
    )
    const conversation = new Conversation(currentUserId,
        currentFriendId, userMessages)
    
    conversation.setMessages();
    conversation.createConversationDiv();   
    conversation.displayUserInfo(currentFriendId, await fetchApi(urlUsers));
    conversation.handleFriendRequest();
}
const buildTasksDiv = async () =>{
    commonTasks.innerHTML = '<h4></h4>';
    const tasksApi = await fetchApi(urlTasks);
    await displayTasks(currentUserId, currentFriendId, tasksApi,
        commonTasks); 

}
const displayConversationTiles = async () =>{
    sideConversations.innerHTML = ''
    const messages = await fetchApi(urlMessages);
    const userMessages = messages.filter(message => 
        (message.reciever === currentUserId || 
            message.sender === currentUserId) 
    
    )
    const userArray = await createUsersArray(userMessages)
    let conversations = [];
    userArray.forEach(user => {
        conversations.push(new Conversation(currentUserId,
            user.user, userMessages));
    });
    conversations.forEach((conversation, i) => {
        conversation.setMessages();
        sideConversations.innerHTML += ConversationTile(
            userArray[i] , conversation.messages
        )
    })
    const ids = userArray.map((user) => user.user);
    addTileEvents(ids);
}
const buildLayout = async () => {
    await buildTasksDiv();
    await displayMessages();
    await displayConversationTiles()
}



const addTileEvents = (ids) => {
    const tiles = document.getElementsByClassName('conversationTile');
    for(let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', async () => {
            currentFriendId = ids[i];
            await buildTasksDiv();
            await displayMessages();
        });
    }
}
sendBtn.addEventListener('click', async () => {
    await sendMessage(token, currentUserId, currentFriendId, 
        messageInput.value ,"reg");
    await buildLayout();
    messageInput.value = '';
})
const initLayout = async () => {
    currentFriendId = await getCurrentFriendId();
    await buildLayout();
}

initLayout();