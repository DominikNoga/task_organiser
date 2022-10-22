import { csrftoken as token } from "../messages/token.js";
import { sendMessage } from '../messages/sendMessage.js';
export const sendFriendRequest = async (sender, reciever, username) =>{
    await sendMessage(token, sender, reciever, createFriendRequestMessage(username, sender), "friend_request")
}

const createFriendRequestMessage = (username, id) =>{
    return `
    Hi ${username}, i want you to be my fiend on 
    task_organiser?
    <div class="buttonsRequest">
        <button class="btn-accept" id="btn-accept${id}">accept</button>
        <button class="btn-reject">rejcet</button>
    </div>
`
}