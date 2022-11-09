import Api from "./api.js";
import AppUserApi from "./appUserApi.js"
const appUserApi = new AppUserApi();
export default class GroupApi extends Api {
    constructor(){
        super();
        this.groupListUrl = "http://127.0.0.1:8000/task_api/group_list/"
        this.createGroupUrl = "http://127.0.0.1:8000/task_api/create_group/";
        this.updateUrl = "http://127.0.0.1:8000/task_api/group_detail/";
        
    }
    async read() {
        return super.read(this.groupListUrl);
    }
    async readDetail(id){
        return super.read(this.updateUrl + id);
    }
    async create (group){
        await super.createOrUpdate(this.createGroupUrl, group, "POST");
    }
    async update(group, id){
        const url = `http://127.0.0.1:8000/task_api/update_group/${id}`;
        await super.createOrUpdate(url, group, "PUT");
    }
    getUserGroups = async (id) => {
        const groups = await this.read(this.groupListUrl);
        return groups.filter(group => group.members.includes(id));
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
    getGroupMembers = async (groupId) => {
        const group = await this.readDetail(groupId);
        const groupPromises = group.members.map(async member => 
            await appUserApi.readDetail(member)
        );
        return Promise.all(groupPromises);
    }
    removeGroupMember = async (groupId, memberId) => {
        const group = await this.readDetail(groupId);
        const index = group.members.indexOf(memberId);
        group.members.splice(index, 1);
        await this.update(group, group.id)
    }
    async delete(id){
        const url = "http://127.0.0.1:8000/task_api/delete_group/" + id;
        await super.delete(url);
    }   
}