import Api from "./api.js";

export default class MessageApi extends Api {
    constructor(){
        super();
        this.messageListUrl = "http://127.0.0.1:8000/task_api/messages_list/";
        
    }
    createMessage = (sender, reciever, content,type) =>{
        return {
            content: content,
            type: type,
            sender: sender,
            reciever: reciever
        }
    }
    async read (){
        return super.read(this.messageListUrl);
    }
    createFriendRequestMessage = (username, id) =>{
        return `
        Hi ${username}, do you want to be my friend on task_organiser?
        <div class="buttonsRequest">
            <button class="btn-accept" id="btn-accept${id}">accept</button>
            <button class="btn-reject">rejcet</button>
        </div>
    `
    }
    sendMessage = async (sender, reciever, content, type) =>{
        const url = "http://127.0.0.1:8000/task_api/send_message/"
        const message = this.createMessage(sender, reciever, content, type)
        await this.createOrUpdate(url,message, "POST")
    }
    getUserMessages = async (currentUserId) => {
        const messages = await this.read(this.messageListUrl);
        return messages.filter(message => 
            (message.reciever === currentUserId || 
                message.sender === currentUserId)
        )
    }
}