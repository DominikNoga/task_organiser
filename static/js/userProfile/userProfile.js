import { displayMessage, displayAcceptMessage } from '../functions.js';
import AppUserApi from "../api/appUserApi.js";
import GroupApi from "../api/groupApi.js";
class LayoutManager{
    constructor(){
        this.userApi = new AppUserApi();
        this.groupApi = new GroupApi();
        this.friendsDiv = document.querySelector(".friends");
        this.groupsDiv = document.querySelector(".groups");
        this.currentUserId = Number(localStorage.getItem("currentUserId"));  
        this.userInfo = document.querySelector(".userInfo");
        this.currentGroupId = -1;
    }
    initInfoDiv = async () =>{
        const user = await this.userApi.readDetail(this.currentUserId)
        this.userInfo.innerHTML = `<div class="userImgDiv">
            <img src="static/img${user.profile_pic}" alt="" class="bigUserImage">
            <div class="editImage">
                <input type="file" placeholder="change profile pic"/> <i class="fa-solid fa-camera"></i>
            </div>
        </div>
        <h2 id="username">${user.username}</h2>`
    }
    friendDiv = (user) =>{
        return `<div class="friend">
    <div class="friendLink" id="friendLink${user.user}">
        <img src="static/img${user.profile_pic}" alt="" class="friendImage">
        <br>
        <small>${user.username}</small>
    </div>
</div>`;
    }
    memberDiv = (member, groupId) => {
        return `<div class="member">
        <img src="static/img${member.profile_pic}" alt="" class="profileImg">
        <div class="memberUsername">${member.username}</div>
        <button class="btn-cancel group${groupId}" id="deleteUser${member.user}" style="visibility:hidden;">X</button>
    </div>
    `
    }
    basicGroupName = (groupName, groupId) => `<strong>${groupName}</strong> 
    <button class="groupNameEditBtn" title="Edit group" id="groupNameEditBtn${groupId}">
        <i class="fa-solid fa-pen-to-square"></i>Edit
    </button>`
    buildMembersDiv = (members, groupId) => {
        return members.reduce((total,member)=> 
            total += this.memberDiv(member, groupId) 
        , "");
    }
    groupDiv = (group, members) =>{
        return `<div class="group" id="group${group.id}">
    <div class="groupName">
        ${this.basicGroupName(group.group_name, group.id)}
    </div>
    <div class="members">
        ${this.buildMembersDiv(members, group.id)}
    </div>
</div>`
    }
    fillGroupsDiv = async () =>{
        this.groupsDiv.innerHTML = "<h2>Group manager</h2>";
        const mathingGroups = await this.groupApi
        .getUserGroups(this.currentUserId);
        for(let group of mathingGroups){
            let members = await this.groupApi.getGroupMembers(group.id);
            this.groupsDiv.innerHTML += this.groupDiv(group, members);
        };
        this.addEditGroupEvents();
        this.addRemoveEvent();
    }
    changeRemoveBtnsVisibility = (visibility="hidden") =>{
        const removeBtns = document.querySelectorAll(".btn-cancel");
        removeBtns.forEach(btn =>{
            if(btn.classList.contains(`group${this.currentGroupId}`))
                btn.style.visibility = visibility;
        })
    }
    editMode = (groupNames, groupNamesValues, btn, index) => {
        let groupName = groupNamesValues[index].innerText;
        const groupId = Number(btn.id.slice(16));
        this.currentGroupId = groupId;
        groupNames[index].innerHTML = `<input type="text" value="${groupName}"/> 
        <button type="button" class="btn-submit" id="changeNameBtn${groupId}">save</button>`;
        const saveBtn = document.querySelector(`#changeNameBtn${groupId}`);
        saveBtn.addEventListener("click", ()  => {
            const btnId = Number(saveBtn.id.slice(13));
            this.currentGroupId = btnId;
            const nameInput = document.querySelector(".groupName input");
            groupName = nameInput.value;
            groupNames[index].innerHTML = this.basicGroupName(groupName, groupId);
            this.addEditGroupEvents();
            this.changeRemoveBtnsVisibility();
            this.changeGroupName(groupName, groupId);
        });
    }
    addEditGroupEvents = () =>{
        const editBtns = document.querySelectorAll(".groupNameEditBtn");
        const groupNames = document.querySelectorAll(".groupName");
        const groupNamesValues = document.querySelectorAll(".groupName strong");
        editBtns.forEach((btn, index) =>{
            btn.addEventListener("click", async () =>{
                this.editMode(groupNames, groupNamesValues,btn, index);
                this.changeRemoveBtnsVisibility("visible");
            });
        });
    }
    changeGroupName = async (groupName, id) => {
        const group = await this.groupApi.readDetail(id);
        group.group_name = groupName;
        await this.groupApi.update(group, id);
    }
    removeUserFromGroup = async (id) =>{
        await this.groupApi.removeGroupMember(this.currentGroupId,id);
        const user = await this.userApi.readDetail(id);
        displayMessage(`You have successfully removed user ${user.username} from your group`);
        this.init();
    }
    addRemoveEvent = async () => {
        const removeBtns = document.querySelectorAll(".btn-cancel");
        removeBtns.forEach(btn =>{
            btn.addEventListener("click",async () =>{
                displayAcceptMessage("Are you sure you want to remove this user from the group?");
                const subBtn = document.querySelector("#popupSubmit")
                const cancelBtn = document.querySelector("#popupCancel")
                const id = Number(btn.id.slice(10));
                try {
                    const result = await this.waitForPopup(subBtn, cancelBtn);
                    if(result === 1)
                        await this.removeUserFromGroup(id);
                } catch (error) {}
            });
        });
    }
    addFriendClickEvent = () =>{
        const links = document.querySelectorAll(".friendLink");
        links.forEach((link) =>{
            link.addEventListener("click", () =>{
                this.currentUserId = Number(link.id.slice(10));
                this.friendsDiv.innerHTML = "<h2 class='title'>Your friends</h2>";
                this.fillFriendsDiv(this.currentUserId);
                this.initInfoDiv();
                this.groupsDiv.innerHTML = "<h2>Group manager</h2>";
                this.fillGroupsDiv();
            })
        });
    }
    fillFriendsDiv = async () =>{
        this.friendsDiv.innerHTML = "<h2 class='title'>Your friends</h2>";
        const allUsers = await this.userApi.read();
        const currentUser = await this.userApi.readDetail(this.currentUserId);
        const friends = allUsers.filter(user =>
            currentUser.friends.includes(user.user)
        );
        friends.forEach(friend => {
            this.friendsDiv.innerHTML += this.friendDiv(friend);
        });
        this.addFriendClickEvent();
    }
    init = () => {
        this.initInfoDiv();
        this.fillFriendsDiv();
        this.fillGroupsDiv();
    }
    waitForPopup = (subBtn, cancelBtn) =>{
        const body = document.querySelector("body");
        const popup = document.querySelector(".popupMessage");
        return new Promise((resolve, reject) =>{        
            subBtn.addEventListener('click', () =>{
                body.removeChild(popup);
                resolve(1);
            })
            cancelBtn.addEventListener('click', () =>{
                body.removeChild(popup);
                reject();
            })
        })
    }
}

const lm = new LayoutManager();
lm.init();