import Conversation from "./conversation.js";
import { displayTasks } from "./displayTasks.js";
import TaskApi from "../api/taskApi.js";
import AppUserApi from "../api/appUserApi.js";
import MessageApi from "../api/messageApi.js";
import GroupMessageApi from "../api/groupMessageApi.js";
import GroupApi from "../api/groupApi.js";
import GroupConversation from "./groupConversation.js";
let groupMode = false;
const userApi = new AppUserApi();
const taskApi = new TaskApi();
const groupMessageApi = new GroupMessageApi();
const groupApi = new GroupApi();
const messageApi = new MessageApi();
const currentUserId = Number(
    document.getElementById("currentId").innerHTML);
const sideConversations = document.getElementsByClassName('sideConversations')[0];
const sendBtn = document.getElementsByClassName('btn-submit')[0];
const messageInput= document.getElementsByClassName('messageInput')[0];
const commonTasks = document.getElementsByClassName('commonTasks')[0];
let currentFriendId = null;
let currentGroupId = null;

const getCurrentFriendId = async () => {
    const userMessages = await messageApi.getUserMessages(currentUserId);
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
    let users = await userApi.read();
    users = users.filter(user => idsSet.has(user.user))
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
const groupConversationTile = (group, messages) =>{
    return `<div class="groupConversationTile">
    <div>
        ${group.group_name}
        <br/>
        <small>${messages[messages.length-1].content}</small>
    </div>
</div>`
}
const displayMessages = async ()=>{
    const userMessages = await messageApi.getUserMessages(currentUserId);
    const conversation = new Conversation(currentUserId,
        currentFriendId, userMessages)
    conversation.setMessages();
    conversation.createConversationDiv();   
    conversation.displayUserInfo(currentFriendId, await userApi.read());
    conversation.handleFriendRequest();
}
const displayGroupMessages = async ()=>{
    const groups = await groupApi.read();
    const messages = await groupMessageApi.getGroupMessages(currentGroupId)
    const conversation = new GroupConversation(currentUserId,
        messages,currentGroupId)
    conversation.createConversationDiv();   
    conversation.displayGroupInfo(groups);
}
const buildTasksDiv = async () =>{
    commonTasks.innerHTML = '<h4></h4>';
    const tasksApi = await taskApi.read();
    displayTasks(currentUserId, currentFriendId, tasksApi,
        commonTasks);
}
const displayGroupTiles = async () =>{
    const userGroups = await groupApi.getUserGroups(currentUserId)
    const allMessages = await groupMessageApi.read();
    const nonEmpty = userGroups.filter(group => {
        for(let mess of allMessages) {
            if(mess.reciever === group.id)
                return true;
        }
        return false;
    });
    const groupConversations = [];
    for(let group of nonEmpty){
        const groupMessages = await groupMessageApi.getGroupMessages(group.id);
        groupConversations.push(
            new GroupConversation(currentUserId, groupMessages, group.id)
        )
    }
    groupConversations.forEach((conversation, i) => {
        sideConversations.innerHTML += groupConversationTile(
            nonEmpty[i] , conversation.messages
        )
    })
    const ids = nonEmpty.map((group) => group.id);
    return ids;

}
const displayConversationTiles = async () =>{
    sideConversations.innerHTML = '';
    const userMessages = await messageApi.getUserMessages(currentUserId);
    const userArray = await createUsersArray(userMessages)
    const conversations = [];
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
    return ids;
}
const buildLayout = async () => {
    await buildTasksDiv();
    if(groupMode)
        await displayGroupMessages();
    else
        await displayMessages();
    await displayConversationTiles();
    const frinedsIds = await displayConversationTiles();
    const groupIds = await displayGroupTiles();
    await addTileEvents(frinedsIds);
    await addGroupTileEvents(groupIds);
}
const friendTileEvent = async (id) =>{
    currentFriendId = id;
    await buildTasksDiv();
    await displayMessages();
    groupMode = false;
}
const addTileEvents = async (ids) => {
    const tiles = document.querySelectorAll('.conversationTile');
    for(let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', async () => {
            await friendTileEvent(ids[i]);
        });
    }
}
const groupTileEvent = async (id) => {
    currentGroupId = id;
    await displayGroupMessages();
    groupMode = true;
}
const addGroupTileEvents = async (ids) =>{
    const tiles = document.querySelectorAll('.groupConversationTile');
    for(let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', async () => {
            await groupTileEvent(ids[i])
        });
    }
}
sendBtn.addEventListener('click', async () => {
    if(groupMode)
        await groupMessageApi.sendMessage(currentUserId,currentGroupId, messageInput.value);
    else
        await messageApi.sendMessage(currentUserId, currentFriendId, messageInput.value ,"reg");
    await buildLayout();
    messageInput.value = '';
})
const initLayout = async () => {
    currentFriendId = await getCurrentFriendId();
    await buildLayout();
}

initLayout();