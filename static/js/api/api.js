import { csrftoken } from "../messages/token.js";
export default class Api {
    delete = async (url) => {
        const options = {
            method: "DELETE",
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
        }
        await fetch(url, options);
    }
    createOrUpdate = async (url, object, method) => {
        const options = {
            method: method,
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify(object)
        };
        await fetch(url, options);
    }
    read = async (url) => {
        const api = await fetch(url);
        const apiJson = await api.json();
        return apiJson;
    }
    
}