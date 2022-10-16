export default class Conversation{
    constructor(currentUserId,otherUserId, messages){
        this._userId = currentUserId;
        this._otherUserId = otherUserId;
        this._messages = messages;
        this.currentMessages = document.getElementsByClassName('currentMessages')[0];
        this.MESSAGE_CLASS = "messageBig";
        this.infoDiv = document.getElementsByClassName('info')[0];
    }
    get otherUserId(){
        return this._otherUserId
    }
    get messages(){
        return this._messages;
    }
    messageDiv = (message, css_class) =>{
        return `<div class="${this.MESSAGE_CLASS} ${css_class}">
    ${message.content}
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
    setMessages = () => {
        this._messages = this._messages.filter(message => {
            return (message.sender === this.otherUserId ||
                message.reciever === this.otherUserId)
        })
    }
}
