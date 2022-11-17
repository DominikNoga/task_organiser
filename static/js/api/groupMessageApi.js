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
            sender: sender,
            reciever: reciever
        }
    }
    sendMessage = async (sender, reciever, content) =>{
        const url = "http://127.0.0.1:8000/task_api/send_group_message/"
        const message = this.createMessage(sender, reciever, content)
        await this.createOrUpdate(url,message, "POST")
    }
    getGroupMessages = async (groupId) => {
        const messages = await this.read();
        const mess = messages.filter(message => message.reciever === groupId);
        return mess
    }
    getUserMessages = async (userId) => {
        const messages = await this.read();
        const mess = messages.filter(message => message.sender === userId);
        return mess;
    }
}