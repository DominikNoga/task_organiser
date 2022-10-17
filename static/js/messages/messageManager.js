export default class MessageManager {
    constructor(){

    }   
    createFriendRequestMessage = (user) =>{
        return `<div class="messageBig friendRequest">
        Hi ${user.username}, i want you to be my fiend on 
        task_organiser?
        <div class="buttonsRequest">
            <button class="btn-accept">accept</button>
            <button class="btn-reject">rejcet</button>
        </div>
    </div>`
    }
}