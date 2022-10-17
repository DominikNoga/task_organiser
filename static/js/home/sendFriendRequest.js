import {fetchApi} from '../functions.js';
import { csrftoken as token } from "./token.js";
import { sendMessage } from '../messages/sendMessage.js';
export const sendFriendRequest = async (sender, reciever) =>{
    await sendMessage(token, sender, reciever, createFriendRequestMessage())
}

const createFriendRequestMessage = (user) =>{
    return `<div class="messageBig friendRequest">
    Hi ${user.username}, i want you to be my fiend on 
    task_organiser?
    <div class="buttonsRequest">
        <button class="btn-accept">accept</button>
        <button class="btn-reject">rejcet</button>
    </div>
</div>`
}