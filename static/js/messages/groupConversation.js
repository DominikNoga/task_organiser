import Conversation from "./conversation.js"
export default class GroupConversation extends Conversation{
    constructor(currentUserId, otherUserId, messages, currentGroup){
        super(currentUserId, otherUserId, messages);
        this.urlMessages = "http://127.0.0.1:8000/task_api/group_message_list/";
    }
    messageDiv = (message, cssClass, senderUsername) =>{
        return `<div class="${this.MESSAGE_CLASS} ${cssClass}">
    ${message.content}
    <br>
    <small>${senderUsername}</small>
</div>`
    }
    createConversationDiv = () =>{
        this.currentMessages.innerHTML = '';
        let css_class = null;
        this.messages.forEach(message => {
            css_class = "fromYou";
            if(message.sender === this.otherUserId)
                css_class = "toYou";
            
            this.currentMessages.innerHTML += this.messageDiv(message, 
                css_class);
        });
    }
}