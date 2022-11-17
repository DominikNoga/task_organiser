import GroupMessageApi from "../api/groupMessageApi.js";
import GroupApi from "../api/groupApi.js";
import AppUserApi from "../api/appUserApi.js";
export default class GroupConversation {
    constructor(currentUserId, messages, currentGroup){
        this.currentUserId = currentUserId;
        this.messages = messages;
        this.currentGroup = currentGroup;
        this.api = new GroupMessageApi();
        this.groupApi = new GroupApi();
        this.currentMessages = document.querySelector('.currentMessages');
        this.MESSAGE_CLASS = "messageBig";
        this.infoDiv = document.querySelector('.info');
        this.appUserApi = new AppUserApi();
        this.h4 = document.querySelector(".commonTasks h4");
        this.currentMessages.scrollTop = this.currentMessages.scrollHeight;
    }
    messageDiv = (message, cssClass, senderUsername) =>{
        return `<div class="${this.MESSAGE_CLASS} ${cssClass}">
    ${message.content}
    <br>
    <small>${senderUsername}</small>
</div>`;
    }
    createConversationDiv = async () =>{
        this.currentMessages.innerHTML = '';
        let css_class = null;
        const users = await this.appUserApi.read();
        this.messages.forEach(message => {
            css_class = "fromYou";
            if(message.sender !== this.currentUserId)
                css_class = "toYou";
            
            const senderUsername = users.find(user => user.user === message.sender).username;
            this.currentMessages.innerHTML += this.messageDiv(message, css_class, senderUsername);
        });
    }
    fillInfoDiv = (group) =>{
        this.infoDiv.innerHTML = `<b>${group.group_name}</b>`
    }
    setMessages = async () => {
        this.messages = await this.api.getGroupMessages(this.currentGroup)
    }
    displayGroupInfo = (groups) =>{      
        const currentGroup = groups.find(group => group.id === this.currentGroup)
        this.fillInfoDiv(currentGroup);
        this.h4.innerHTML = `Tasks for group ${currentGroup.group_name}`;
    }
}