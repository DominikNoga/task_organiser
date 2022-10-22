const createMessage = (sender, reciever, content,type) =>{
    return JSON.stringify({
        content: content,
        type: type,
        sender: sender,
        reciever: reciever
    })
}
export const sendMessage = async (token, sender, reciever, content, type) =>{
    const url = "http://127.0.0.1:8000/task_api/send_message/"
    const options = {
        method: "POST",
        headers: {
            'Content-type':"application/json",
            'X-CSRFToken': token
        },
        body: createMessage(sender, reciever, content, type)
    }
    await fetch(url, options);
}