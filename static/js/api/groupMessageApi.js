import Api from "./api.js";

export default class GroupMessageApi extends Api {
    constructor(){
        super();
        this.messageListUrl = "http://127.0.0.1:8000/task_api/group_message_list/";
    }
    async read(){
        return super.read(this.messageListUrl);
    }
    createMessage = (sender, reciever, content) =>{
        return {
            content: content,
            type: type,
            sender: sender,
            reciever: reciever
        }
    }
    sendMessage = async (sender, reciever, content, type) =>{
        const url = "http://127.0.0.1:8000/task_api/send_group_message/"
        const message = this.createMessage(sender, reciever, content, type)
        await this.createOrUpdate(url,message, "POST")
    }
    getGroupMessages = async (groupId) => {
        const messages = await this.read(this.messageListUrl);
        return messages.filter(message => message.reciever === groupId)
    }
}