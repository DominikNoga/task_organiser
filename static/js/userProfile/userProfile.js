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
    }
    initInfoDiv = async () =>{
        const user = await this.userApi.readDetail(this.currentUserId)
        this.userInfo.innerHTML = `<img src="static/img${user.profile_pic}" alt="" class="bigUserImage">
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
    memberDiv = (member) => {
        return `<div class="member">
        <img src="static/img${member.profile_pic}" alt="" class="profileImg">
        <div class="memberUsername">${member.username}</div>
        <button class="btn-cancel" id="deleteUser${member.user}">X</button>
    </div>
    `
    }
    basicGroupName = (groupName, groupId) => `<div class="groupName">
    <strong>${groupName}</strong> <button class="groupNameEditBtn" title="Edit group name"
    id="groupNameEditBtn${groupId}"><i class="fa-solid fa-pen-to-square"></i></button>
</div>`
    buildMembersDiv = (members) => {
        return members.reduce((total,member)=> 
            total += this.memberDiv(member) 
        , "");
    }
    groupDiv = (group, members) =>{
        return `<div class="group">
    ${this.basicGroupName(group.group_name, group.id)}
    <div class="members">
        ${this.buildMembersDiv(members)}
    </div>
</div>`
    }
    fillGroupsDiv = async () =>{
        const mathingGroups = await this.groupApi
        .getUserGroups(this.currentUserId);
        for(let group of mathingGroups){
            let members = await this.groupApi.getGroupMembers(group.id);
            this.groupsDiv.innerHTML += this.groupDiv(group, members);
        };
        this.addEditGroupEvents();
        this.addRemoveEvent();
    }
    editName = (groupNames, groupNamesValues, btn, index) => {
        const groupId = Number(btn.id.slice(16));
        let groupName = groupNamesValues[index].innerText;
        groupNames[index].innerHTML = `<input type="text" value="${groupName}"/> 
        <button type="button" class="btn-submit" id="changeNameBtn${groupId}">save</button>`;
        const saveBtn = document.querySelector(`#changeNameBtn${groupId}`);
        saveBtn.addEventListener("click", ()  => {
            const nameInput = document.querySelector(".groupName input");
            groupName = nameInput.value;
            this.changeGroupName(groupName, groupId);
            groupNames[index].innerHTML = this.basicGroupName(groupName, groupId);
            this.addEditGroupEvents();
        });
    }
    addEditGroupEvents = () =>{
        const editBtns = document.querySelectorAll(".groupNameEditBtn");
        const groupNames = document.querySelectorAll(".groupName");
        const groupNamesValues = document.querySelectorAll(".groupName strong");
        editBtns.forEach((btn, index) =>{
            btn.addEventListener("click", async () =>{
                this.editName(groupNames, groupNamesValues, btn, index);
            });
        });
    }
    changeGroupName = async (groupName, id) => {
        const group = await this.groupApi.readDetail(id);
        group.group_name = groupName;
        await this.groupApi.update(group, id);
    }
    addRemoveEvent = async () => {
        const removeBtns = document.querySelectorAll(".btn-cancel");
        removeBtns.forEach(btn =>{
            btn.addEventListener("click",async () =>{
                displayAcceptMessage("Are you sure you want to remove this user from the group?");
                const subBtn = document.querySelector("#popupSubmit")
                const cancelBtn = document.querySelector("#popupCancel")
                try {
                    await this.waitForPopup(subBtn, cancelBtn);
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
        const popup = document.querySelector(".popupMessage");
        return new Promise((resolve, reject) =>{        
            subBtn.addEventListener('click', () =>{
                popup.style.display = 'none';
                resolve();
            })
            cancelBtn.addEventListener('click', () =>{
                popup.style.display = 'none';
                reject();
            })
        })
    }
}

const lm = new LayoutManager();
lm.init();