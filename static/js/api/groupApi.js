import Api from "./api.js";

export default class GroupApi extends Api {
    constructor(){
        super();
        this.groupListUrl = "http://127.0.0.1:8000/task_api/group_list/"
        this.createGroupUrl = "http://127.0.0.1:8000/task_api/create_group/";
    }
    getCurrentUserGroups = async () => {
        const groups = await this.read(this.groupListUrl);
        return groups.filter(group => 
            group.members.includes(
                Number(localStorage.getItem("currentUserId"))
            )
        );
    }
    getGroupId = async (name) =>{
        const groups = await this.read(this.groupListUrl);
        return groups.find(g => g.group_name === name).id;
    }
    getGroupName = async (id) => {
        const groups = await this.read(this.groupListUrl);
        const currentGroup = groups.find(g => g.id === id);
        if(currentGroup !== undefined)
            return currentGroup.group_name;
        
        return "Just You";
    }   
}