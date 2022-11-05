import { csrftoken } from "../messages/token.js";
export default class Api {
    async delete (url){
        const options = {
            method: "DELETE",
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
        }
        await fetch(url, options);
    }
    async createOrUpdate(url, object, method){
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
    async read (url){
        const api = await fetch(url);
        const apiJson = await api.json();
        return apiJson;
    }
    async readDetail(url, id){
        return this.read(url + id);
    }
    
}