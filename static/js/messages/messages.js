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
    if (userMessages.length < 1)
        return;
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
const basicConversationDiv = () =>{
    return `<div class="friendSelect">
    <h3>Chats</h3>
    <input type="text" id="friendSelectInput" placeholder="Friend or group name ...">
</div> 
<div id="friendsAndGroups">

</div><br>
<div class="friendTiles">
                
</div>`;
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
        commonTasks, groupMode, currentGroupId);
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
    const friendTiles = document.querySelector(".friendTiles")
    groupConversations.forEach((conversation, i) => {
        friendTiles.innerHTML += groupConversationTile(
            nonEmpty[i] , conversation.messages
        )
    })
    const ids = nonEmpty.map((group) => group.id);
    return ids;

}
const displayConversationTiles = async () =>{
    sideConversations.innerHTML = basicConversationDiv();
    const userMessages = await messageApi.getUserMessages(currentUserId);
    const userArray = await createUsersArray(userMessages);
    const conversations = [];
    userArray.forEach(user => {
        conversations.push(new Conversation(currentUserId,
            user.user, userMessages));
    });
    const friendTiles = document.querySelector(".friendTiles")
    conversations.forEach((conversation, i) => {
        conversation.setMessages();
        friendTiles.innerHTML += ConversationTile(
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
    await chooseFriend();
}
const friendTileEvent = async (id) =>{
    currentFriendId = id;
    groupMode = false;
    await buildTasksDiv();
    await displayMessages();   
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
    groupMode = true;
    currentGroupId = id;
    await displayGroupMessages();
    await buildTasksDiv();
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
const friendDiv = (friend) => {
    return `<div class="friendTile" id="friendTile${friend.user}">
        <img class="profileImg" src="static/img${friend.profile_pic}" alt=""/> <b>${friend.username}</b>
    </div>
    `
}
const groupDiv = (group) => {
    return `<div class="friendTile" id="groupTile${group.id}">
        <p>Group:</p> <b>${group.group_name}</b>
    </div>
    `
}
const findFriendsAndGroups =async (username) =>{
    const groups = await groupApi.getUserGroups(currentUserId);
    const friends = await userApi.getUserFriends(currentUserId);
    const matchingFriends = friends.filter(friend => friend.username.includes(username));
    const matchingGroups = groups.filter(group => group.group_name.includes(username));
    return [matchingFriends, matchingGroups];
}
const fillFriendsAndGroupsDiv = (friends, groups) =>{
    const friendsAndGroupsDiv = document.querySelector("#friendsAndGroups")
    friends.forEach(friend => {
        friendsAndGroupsDiv.innerHTML += friendDiv(friend); 
    });
    groups.forEach(group =>{
        friendsAndGroupsDiv.innerHTML += groupDiv(group);
    })
}
const chooseFriend = async () => {
    const friendsAndGroupsDiv = document.querySelector("#friendsAndGroups")
    const friendsIndex = 0, groupsIndex = 1;
    const friendSelectInput = document.querySelector("#friendSelectInput");
    friendSelectInput.addEventListener("input", async () => {
        friendsAndGroupsDiv.innerHTML = '';
        friendsAndGroupsDiv.style.height = '0px';
        if(friendSelectInput.value.length >= 1){
            friendsAndGroupsDiv.style.height = '80vh';
            const friendsAndGroups =  await findFriendsAndGroups(friendSelectInput.value);
            const groups = friendsAndGroups[groupsIndex]
            const friends= friendsAndGroups[friendsIndex];
            fillFriendsAndGroupsDiv(friends, groups);
            addFriendTileEvents();
        }
        
    })
}
const addFriendTileEvents = () =>{
    const friendsAndGroupsDiv = document.querySelector("#friendsAndGroups")
    const tiles = document.querySelectorAll(".friendTile");
    tiles.forEach(tile => {
        tile.addEventListener("click",async () =>{
            let id = Number(tile.id.slice(10));
            groupMode = false;
            if(tile.id.includes("group")){
                id = Number(tile.id.slice(9));
                groupMode = true;
                currentGroupId = id;
            }
            else
                currentFriendId = id;
            friendsAndGroupsDiv.innerHTML = '';
            friendsAndGroupsDiv.style.height = '0px';
            await buildLayout();
        })
    })
}
initLayout();