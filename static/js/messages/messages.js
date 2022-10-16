import Conversation from "./conversation.js";
const sideConversations = document.getElementsByClassName('sideConversation')[0];
const currentUserId = Number(
    document.getElementById("currentId").innerHTML);

let currentFriendId = 4;

const commonTasks = document.getElementsByClassName('commonTasks')[0];

const createConversationTile = (user, lastMessage) =>{
    return `<div class="conversationTile">
    <img src="{{${user.profile_pic}}}" alt="" class="profileImg">
    ${lastMessage}
</div>`
}
const displayMessages = async ()=>{
    const url = "http://127.0.0.1:8000/task_api/messages_list/";
    const messageApi = await fetch(url);
    const messages_json = await messageApi.json();
    const messages = await messages_json;
    const userMessages = messages.filter(message => 
        (message.reciever === currentUserId || 
            message.sender === currentUserId) 
    
    )
    const conversation = new Conversation(currentUserId,
        currentFriendId, userMessages)
    
    conversation.setMessages()
    conversation.createConversationDiv();   
}
const displayUserInfo = async () =>{
    const url = "http://127.0.0.1:8000/task_api/app_users_list/";
    const appUsersApi = await fetch(url);
    const appUsersJson = await appUsersApi.json();
    const appUsers = await appUsersJson;

}

displayMessages();

